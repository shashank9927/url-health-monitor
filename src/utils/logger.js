const fs = require('fs');
const path = require('path');

//create logs directory if it does not exist
const logsDir = path.join(__dirname,'../logs');
if(!fs.existsSync(logsDir)){
    fs.mkdirSync(logsDir);
}

//define log files path
const monitorLogPath = path.join(logsDir, 'monitors.log');
const apiLogPath = path.join(logsDir, 'api.log');
const errorLogPath = path.join(logsDir, 'errors.log');

const logToFile = (message, logFile, printToConsole = false) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    fs.appendFile(logFile, logEntry, (err) => {
        if(err) {
            console.error(`Failed to write to log file: ${err.message}`);
        }
    });

    if(printToConsole){
        console.log(message);
    }
};

exports.logMonitor = (message, printToConsole = false) => { //log monitor related activity
    logToFile(message, monitorLogPath, printToConsole);
};

exports.logApi = (message, printToConsole = true) => { //log api related activity
    logToFile(message, apiLogPath, printToConsole);
};

exports.logError = (message, printToConsole = true) => { //log error messages
    logToFile(message, errorLogPath, printToConsole);
};


