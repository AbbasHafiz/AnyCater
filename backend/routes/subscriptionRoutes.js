const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const checkAuth = require('../middleware/checkAuth');

// Create a new subscription package
router.post('/create', checkAuth, subscriptionController.createSubscriptionPackage);

// Get all subscription packages
router.get('/getAll', checkAuth, subscriptionController.getAllSubscriptionPackages);

// Assign a subscription package to a restaurant owner
router.post('/assign', checkAuth, subscriptionController.assignSubscriptionPackage);

// Get the active subscription of a restaurant owner
router.get('/active/:ownerId', checkAuth, subscriptionController.getActiveSubscription);
// Subscribe a CateringOwner to a subscription package
router.post('/subscribe', checkAuth, subscriptionController.subscribeCateringOwner);
module.exports = router;
