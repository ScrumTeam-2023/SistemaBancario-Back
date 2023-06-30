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
        type: Number,
        require: true
    }
});
module.exports = mongoose.model('Product', productSchema)