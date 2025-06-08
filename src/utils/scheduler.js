//Implementation of scheduler for monitors

const Monitor = require('../models/Monitor.js');
const HealthCheck = require('../models/HealthCheck.js');
const {checkUrl} = require('./urlChecker.js');
const {logMonitor, logError} = require('./logger.js');

let schedulerInterval = null;

//scheduler that checks every minute
const startScheduler = () => {
    //stop existing scheduler
    stopScheduler();

    logMonitor('Starting health check scheduler',false);

    schedulerInterval = setInterval(async() => {
        try {
            //find all active monitors
            const monitors = await Monitor.find({isActive: true});

            if(monitors.length === 0){
                return;
            }

            logMonitor(`Checking ${monitors.length} monitors for scheduled health checks`, false);

            const now = new Date();

            for(const monitor of monitors){
                try {
                    //get last health check for this monitor
                    const lastCheck = await HealthCheck.findOne(
                        {monitorId: monitor._id},
                        {},
                        {sort: {createdAt: -1}}
                    );

                    //if no previous check exists, perform first check
                    if(!lastCheck){
                        logMonitor(`First health check for monitor: ${monitor.name}`, false);
                        await checkUrl(monitor);
                        continue;
                    }

                    //calculate time since last check
                    const timeSinceLastCheck = now - lastCheck.createdAt;
                    const intervalMs = monitor.interval * 60 * 1000; //convert minutes to milliseconds

                    //check if it is time to perform another health check
                    if(timeSinceLastCheck >= intervalMs){
                        logMonitor(`Performing scheduled health check for: ${monitor.name} (interval: ${monitor.interval} min)`, false);
                        await checkUrl(monitor);
                    }
                }
                catch(monitorErr){
                    logMonitor(`Error processing monitor ${monitor.name}: ${monitorErr.message}`, false);
                }   
            }
        }
        catch(err){
            logMonitor(`Scheduler error: ${err.message}`, false);
        }        
    }, 60000); 

    logMonitor('Health check scheduler started - checking every minute for monitors due for checking', false);
}

//stop scheduler

const stopScheduler = () => {
    if(schedulerInterval){
        clearInterval(schedulerInterval);
        schedulerInterval = null;
        logMonitor(`Health check scheduler stopped`, false);
    }
};

//check if scheduler is running
const isSchedulerRunning = () => {
    return schedulerInterval !== null;
};


module.exports = {
  startScheduler,
  stopScheduler,
  isSchedulerRunning
};