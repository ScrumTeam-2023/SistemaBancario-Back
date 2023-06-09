'use strict'

const mongoose = require('mongoose');

const depositeSchema = mongoose.Schema({
    
    numberAccount:{
        type: Number,
        required: true,
        unique: true
    },
    user: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
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

module.exports = mongoose.model('Deposite', depositeSchema)