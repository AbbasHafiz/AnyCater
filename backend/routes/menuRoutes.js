const express = require('express');
const router = express.Router();
const menuController = require('../controllers/manuCantroller');
const { check } = require('express-validator');

// Create a new menu
router.post(
    '/create-menu',
    [
        // Add validation using express-validator if required
        check('name').not().isEmpty(),
        check('description').not().isEmpty(),
        check('cateringShopId').not().isEmpty(),
    ],
    menuController.createMenu
);

// Update menu details
router.patch('/update-menu/:id', menuController.updateMenu);

// Get menus by CateringShop ID
router.get('/menus/:id', menuController.getMenuByCateringShopId);

// Delete a menu
router.delete('/delete-menu/:id', menuController.deleteMenu);

module.exports = router;
