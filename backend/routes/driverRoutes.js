const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

// Create a new driver
router.post('/create-driver', driverController.createDriver);

// Assign an order to a driver
router.patch('/assign-order/:id', driverController.assignOrderToDriver);

module.exports = router;
