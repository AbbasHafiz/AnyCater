const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem' // Change to 'Menu' if referencing Menu instead of MenuItem
    }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
