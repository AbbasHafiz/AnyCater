const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const checkRole = require('../middleware/checkRole');

// Route to create a new category (accessible by all roles)
router.post('/create-category', categoryController.createCategory);

// Route to add an item to a category (protected by "admin" role)
router.patch('/add-item/:id', checkRole('admin'), categoryController.addItemToCategory);

// Add other category-related routes as necessary

module.exports = router;
