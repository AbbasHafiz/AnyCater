const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = new mongoose.Schema({
  
    username: {
        type: String,
        required: true,
       // unique: true
    },
     name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
       unique: true
    },
    phoneNo: { type: String },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Owner', 'User'],
        default: 'User'
    },
    image: { type: String },
    token: {
        type: String
        // Add any other configurations as needed (e.g., unique, required, etc.)
    },
    locations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    }]
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);

module.exports = User;
