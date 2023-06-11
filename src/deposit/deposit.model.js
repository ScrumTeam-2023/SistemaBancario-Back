'use stric'
const mongoose = require('mongoose');

const depositSchema = mongoose.Schema({
  sourceAccount: {
    type: Number,
    required: true,
  },
  destinationAccount: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Deposit', depositSchema);