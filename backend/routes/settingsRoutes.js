// routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const fileUpload = require('../middleware/file-upload');

router.get('/settings', settingsController.getSettings);
router.put('/settings', fileUpload.single('image'), settingsController.updateSettings);
// Fetch slider images
router.get('/slider', settingsController.getSliderImages);

module.exports = router;
