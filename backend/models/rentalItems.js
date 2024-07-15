const mongoose = require('mongoose');

const rentalItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  cateringShop: { type: mongoose.Types.ObjectId, ref: 'CateringShop', required: true },
});

module.exports = mongoose.model('RentalItem', rentalItemSchema);
