// create a monitor response object

const createMonitorResponse = (monitor) => {
    const responseData = {
        id: monitor._id,
        name: monitor.name,
        url: monitor.url,
        method: monitor.method,
        expectedStatus: monitor.expectedStatus,
        expectedResponseTime: monitor.expectedResponseTime,
        interval: monitor.interval,
        isActive: monitor.isActive,
        createdAt: monitor.createdAt,
        updatedAt: monitor.updatedAt
    };

    return responseData;
};

const convertHeadersToMap = (headers) => {
    if(!headers || typeof headers !== 'object' || headers instanceof Map){
        return headers;
    }
    const headersMap = new Map();
    Object.entries(headers).forEach(([key, value]) => {
        headersMap.set(key, value);
    });
    return headersMap;
};

module.exports = {
  createMonitorResponse,
  convertHeadersToMap
};
