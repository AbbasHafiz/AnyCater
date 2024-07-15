const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Get user's location
router.get('/user-location/:id', locationController.getUserLocation);
router.post('/add-user-location/:id', locationController.addUserLocation);
// Update user's location
router.patch('/update-user-location/:id', locationController.updateUserLocation);

module.exports = router;
