const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
        // You might want to specify specific categories or use an enum
    },
    image: {
        type: String // Assuming you store the image URL as a string
        // You can also configure this as an array if multiple images are allowed
    },
    cateringShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CateringShop',
        required: true
    }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
