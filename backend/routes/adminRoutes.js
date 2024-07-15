const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const checkRole = require('../middleware/checkRole');

// Example route to access the admin dashboard (accessible only by "admin" role)
router.get('/dashboard', checkRole('admin'), adminController.getAdminDashboard);

// Other admin-specific routes
// router.get('/other-route', checkRole('admin'), adminController.otherAdminFunction);

module.exports = router;
