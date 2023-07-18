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
    },
    amount: {
        type: Number,
        required: true,
      },
    date:{
        type: Number, 
    },

});
module.exports = mongoose.model('Compras', compraSchema);