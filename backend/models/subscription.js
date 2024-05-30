// subscriptionPackage.js

const mongoose = require('mongoose');

const subscriptionPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  durationMonths: {
    type: Number,
    required: true,
  },
});

const SubscriptionPackage = mongoose.model('SubscriptionPackage', subscriptionPackageSchema);

module.exports = SubscriptionPackage;
