'use strict'

const mongoose = require('mongoose');

const transferSchema = mongoose.Schema({
    
    numberAccount:{
        type: Number,
        required: true,
        unique: true
    },

    dpi:{
        type: Number,
        require: true
    },
    date:{
        type: Date,
        required: true
    },
    saldo:{
        type: Number,
        require: true
    },
    
});

module.exports = mongoose.model('Transfer', transferSchema)