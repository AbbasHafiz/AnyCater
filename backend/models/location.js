const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    latitude: {
        type: Number,
       
    },
    longitude: {
        type: Number,
        
    },
    address: {
        type: String,
        
    }
});

locationSchema.index({ "coordinates": "2dsphere" }); // Creating a 2dsphere index for geospatial queries

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
