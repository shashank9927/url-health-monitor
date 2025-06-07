const axios = require('axios');
const HealthCheck = require('../models/HealthCheck.js');

exports.checkUrl = async (monitor) => {
    const startTime = Date.now();
    let responseTime = null;
    let statusCode = null;
    let status = 'down';
    let error = null;
    
    try{
        //configure request based on monitor settings
        const requestConfig = {
            method: monitor.method,
            url: monitor.url,
            timeout: monitor.expectedResponseTime,
            validateStatus: () => true,
            headers: {} //initialize empty header object
         };

         //add headers if present
         if(monitor.headers){
            if(monitor.headers instanceof Map){
                monitor.headers.forEach((value,key) => {
                    if(!key.startsWith('$') && !key.startsWith('_')){
                        requestConfig.headers[key]=value;
                    }
                });
            }
            else if(typeof monitor.headers === 'object'){
                const headersObj = monitor.headers.toObject ? monitor.headers.toObject() : monitor.headers;
                Object.entries(headersObj).forEach(([key,value])=>{
                    if(!key.startsWith('$') && !key.startsWith('_')){
                        requestConfig.headers[key] = value;
                    }
                });
            }
         }

         if(monitor.body && monitor.method !== 'GET'){
            try{
                requestConfig.data = JSON.parse(monitor.body);

            }
            catch(err){
                requestConfig.data = monitor.body;
            }
         }

         //make the request
         const response = await axios(requestConfig);

         //calculate response time
         responseTime = Date.now() - startTime;
         statusCode = response.status;

         if(response.status === monitor.expectedStatus){
            status = 'up';
         }
         else{
            status = 'down';
            error = `Expected status ${monitor.expectedStatus}, got ${response.status}`;
         }         
    }
    catch(err){
        responseTime = Date.now() - startTime;
        error = err.message;
    }

    //create and save health check
    const healthCheck = new HealthCheck({
        monitorId: monitor._id,
        status,
        responseTime,
        statusCode,
        error
    });

    await healthCheck.save();
    return healthCheck;
};