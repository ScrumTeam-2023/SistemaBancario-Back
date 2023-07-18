  const mongoose = require('mongoose');

  const purchaseSchema = mongoose.Schema({
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    servicePrice: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userBalance: {
      type: Number,
      required: true,
    },
    date: {
      type: Number,
      
    },
  });

  const Purchase = mongoose.model('Purchase', purchaseSchema);

  module.exports = Purchase;
