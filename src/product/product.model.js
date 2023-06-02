'use strict'

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

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
    stock:{
        type: String,
        require: true
    },
    user:{
        type: mongoose.Schema.Types.ObjetId,
        ref: 'User',
        required: true
    }
});
module.exports = mongoose.model('Product', productSchema)