const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },

    url:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: function(v){
                try {
                    new URL(v);
                    return true;
                }
                catch(err){
                    return false;
                }
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },

    method: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
        default: 'GET'
    },

    headers: {
        type: Map,
        of: String,
        default: {}

    },

    body: {
        type: String,
        default: ''
    },

    expectedStatus: {
        type: Number,
        default: 200
    },

    interval: {
        type: Number,
        default: 5, // 5 minutes
        min: 1 //time interval should be atleast 1 minute
    },

    isActive: {
        type: Boolean,
        default: true
    }

    },
    {
        timestamps: true
    }    
    );

module.exports = mongoose.model('Monitor',monitorSchema);