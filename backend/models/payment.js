// paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  method: {
    type: String,
    enum: ['COD', 'Easypaisa', 'JazzCash'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  // Add other relevant fields
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
