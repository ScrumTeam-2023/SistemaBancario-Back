'use strict'

const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    
    name:{
        type: String,
        required: true,
        unique: true
    },

    description:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        required: true
    },
    historial:{
        type: String,
        require: true
    },
    state:{
        type: String,
        enum: ['DISPONIBLE','NO DISPONIBLE'],
        default:'DISPONIBLE',
        uppercase: true 
    },
    balance:{
        type: Number,
        required: false,
        default: 0
    }
    
});

module.exports = mongoose.model('Service', serviceSchema)