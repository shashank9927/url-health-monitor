const Monitor = require('../models/Monitor.js');
const HealthCheck = require('../models/HealthCheck.js');

const getMonitorStats = async(monitorId, startDate, endDate) => {
    const dateFilter = {};

    if(startDate){
        dateFilter.$gte = startDate;
    }
    if(endDate) {
        dateFilter.$lte = endDate;
    }

    const query = {monitorId};

    if(Object.keys(dateFilter).length > 0){
        query.createdAt = dateFilter;
    }

    //get all health checks for the monitor in the given data range
    const healthChecks = await HealthCheck.find(query).sort({createdAt: 1});

    if(healthChecks.length === 0 ){
        return {
            totalChecks: 0,
            upChecks: 0,
            downChecks: 0,
            uptime: 0,
            averageResponseTime: 0,
            minResponseTime: null,
            maxResponseTime: null,
            checks: []
        };

    }

    //calculate statistics
    const upChecks = healthChecks.filter(check => check.status === 'up');
    const responseTimes = healthChecks
                                .filter(check => check.responseTime)
                                .map( check => check.responseTime);

    const stats = {
        totalChecks: healthChecks.length,
        upChecks: upChecks.length,
        downChecks: healthChecks.length - upChecks.length,
        uptime: upChecks.length / healthChecks.length * 100,
        averageResponseTime: responseTimes.length ?  responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0,
        minResponseTime: responseTimes.length ? Math.min(...responseTimes) : null,
        maxResponseTime: responseTimes.length ? Math.max(...responseTimes) : null,
        firstCheck: healthChecks[0].createdAt,
        lastCheck: healthChecks[healthChecks.length - 1].createdAt

    };
    return stats;

};

const getOverallStats = async () => {
    const monitors = await Monitor.find({});
    const activeMonitors = monitors.filter(monitor => monitor.isActive);

    const totalHealthChecks = await HealthCheck.countDocuments();
    const upHealthChecks = await HealthCheck.countDocuments({status: 'up'}); 

    return {
    totalMonitors: monitors.length,
    activeMonitors: activeMonitors.length,
    inactiveMonitors: monitors.length - activeMonitors.length,
    totalHealthChecks,
    upHealthChecks,
    downHealthChecks: totalHealthChecks - upHealthChecks,
    overallUptime: totalHealthChecks ? (upHealthChecks / totalHealthChecks * 100) : 0
  };
}
module.exports = {
    getMonitorStats,
    getOverallStats,
}