const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactInformation: {
        type: String // You might want to use a specific type for contact info (e.g., an object with phone, email, etc.)
    },
    assignedOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
