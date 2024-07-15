// cateringOwner.js

const mongoose = require('mongoose');

const cateringOwnerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cateringShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CateringShop',
        required: true
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPackage'
        // Add any other configurations as needed
    },
    paymentMethods: [{
        type: String,
        enum: ['JazCash', 'EasyPaisa', 'bankTransfer', 'cashOnDelivery'],
        // Add other payment methods as needed
    }],
    // Add any other fields related to the CateringOwner model
});

const CateringOwner = mongoose.model('CateringOwner', cateringOwnerSchema);

module.exports = CateringOwner;
