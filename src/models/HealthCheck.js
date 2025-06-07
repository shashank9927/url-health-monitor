const mongoose = require('mongoose');

const healthCheckSchema = new mongoose.Schema({
    monitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monitor',
        required: true
    },

    status: {
        type: String,
        enum: ['up', 'down'],
        required: true
    },

    responseTime: {
        type: Number, //in milliseconds
        default: null
    },

    statusCode: {
        type: Number,
        default: null
    },

    error: {
        type: String,
        default: null
    }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('HealthCheck', healthCheckSchema);