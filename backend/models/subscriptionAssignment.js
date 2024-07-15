// subscriptionAssignment.js

const mongoose = require('mongoose');

const subscriptionAssignmentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPackage',
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const SubscriptionAssignment = mongoose.model('SubscriptionAssignment', subscriptionAssignmentSchema);

module.exports = SubscriptionAssignment;
