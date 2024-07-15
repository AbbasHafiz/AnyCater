const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const { check } = require('express-validator');

// Create a new menu item
router.post(
    '/create-menu-item',
    [
        // Add validation using express-validator if required
        check('name').not().isEmpty(),
        check('description').not().isEmpty(),
        check('price').isNumeric(),
        check('category').not().isEmpty(),
        check('menuId').not().isEmpty(),
        check('cateringShopId').not().isEmpty(),
    ],
    menuItemController.createMenuItem
);

// Update menu item details
router.patch('/update-menu-item/:id', menuItemController.updateMenuItem);

// Delete a menu item
router.delete('/delete-menu-item/:id', menuItemController.deleteMenuItem);

module.exports = router;
