const https = require('https');
const {URL} = require('url');

const checkSSL = async(url) => {
    return new Promise((resolve) => {
        try{
            const urlObj = new URL(url);  // Fix typo here

            //check only https url
            if(urlObj.protocol !== 'https:'){  // Fix typo here
                return resolve({
                    hasSSL: false,
                    message: 'Not an HTTPS URL'
                });
            }

            const options = {
                hostname: urlObj.hostname,  // Fix typo here
                port: 443,
                method: 'GET',
                timeout: 10000,
            };

            const req = https.request(options, (res) => {
                const cert = res.socket.getPeerCertificate();

                if(cert && cert.valid_to){
                    const expiryDate = new Date(cert.valid_to);
                    const now = new Date();
                    const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

                    resolve({
                        hasSSL: true,
                        expiryDate: cert.valid_to,
                        daysLeft: daysLeft,
                        isExpired: daysLeft <= 0,
                        issuer: cert.issuer ? cert.issuer.O : 'Unknown'
                    });
                }
                else {
                    resolve({
                        hasSSL: false,
                        message: 'No certificate found'
                    });
                }  // Fix missing closing brace
            });

            // Add missing error handler
            req.on('error', () => {
                resolve({
                    hasSSL: false,
                    message: 'SSL check failed'
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    hasSSL: false,
                    message: 'SSL check timeout'
                });           
            });

            req.end();
        }
        catch(err){
            resolve({
                hasSSL: false,
                message: 'Invalid URL'
            });
        }
    });
};

module.exports = {checkSSL};