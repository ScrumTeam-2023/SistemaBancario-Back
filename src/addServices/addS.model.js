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
    
});

module.exports = mongoose.model('Service', serviceSchema)