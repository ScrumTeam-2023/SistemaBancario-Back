'use stric'
const mongoose = require('mongoose');

const tranferSchema = mongoose.Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});


module.exports = mongoose.model('Transfer', tranferSchema);