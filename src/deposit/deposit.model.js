'use strict';

const mongoose = require('mongoose');

const depositSchema = mongoose.Schema({
  destinationAccount: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  depositDate: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: String,
    enum: ['completado', 'cancelled'],
    default: 'completado',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});


module.exports = mongoose.model('Deposit', depositSchema);


