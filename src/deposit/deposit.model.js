'use strict';

const mongoose = require('mongoose');

const depositSchema = mongoose.Schema({
  noCuenta: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
  },
  status: {
    type: String,  // Campo de tipo String para almacenar el estado del depósito
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('Deposit', depositSchema);

