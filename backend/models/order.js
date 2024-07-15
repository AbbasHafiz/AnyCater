// order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Delivered'],
        default: 'Pending'
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['creditCard', 'EasyPaisa', 'JazCash', 'cashOnDelivery'], // Add other payment methods as needed
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
