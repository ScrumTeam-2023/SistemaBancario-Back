'use strict'

const mongoose = require('mongoose');

const compraSchema = mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cantidad:{
        type: Number,
        required: false
    }

});
module.exports = mongoose.model('Compras', compraSchema);