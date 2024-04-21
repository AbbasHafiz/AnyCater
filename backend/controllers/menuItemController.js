const MenuItem = require('../models/menuItem');
const Menu = require('../models/menu');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const menuItemController = {
    createMenuItem: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError('Invalid inputs passed, please check your data.', 422));
        }

        const { name, description, price, category, menuId, cateringShopId } = req.body;

        try {
            // Check if the menu and catering shop exist
            const menu = await Menu.findById(menuId);
            if (!menu) {
                return next(new HttpError('Could not find the menu for provided ID.', 404));
            }

            if (menu.cateringShop.toString() !== cateringShopId) {
                return next(new HttpError('Menu does not belong to the provided catering shop.', 403));
            }

            const newMenuItem = new MenuItem({ name, description, price, category, menu: menuId });
            await newMenuItem.save();

            res.status(201).json({ message: 'Menu item created successfully', menuItem: newMenuItem });
        } catch (error) {
            return next(new HttpError('Failed to create menu item', 500));
        }
    },

    updateMenuItem: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError('Invalid inputs passed, please check your data.', 422));
        }

        const menuItemId = req.params.id;
        const { name, description, price, category } = req.body;

        try {
            const updatedMenuItem = await MenuItem.findByIdAndUpdate(menuItemId, { name, description, price, category }, { new: true });

            if (!updatedMenuItem) {
                return next(new HttpError('Menu item not found', 404));
            }

            res.status(200).json({ message: 'Menu item updated successfully', menuItem: updatedMenuItem });
        } catch (error) {
            return next(new HttpError('Failed to update menu item', 500));
        }
    },

    deleteMenuItem: async (req, res, next) => {
        const menuItemId = req.params.id;

        try {
            const deletedMenuItem = await MenuItem.findByIdAndDelete(menuItemId);

            if (!deletedMenuItem) {
                return next(new HttpError('Menu item not found', 404));
            }

            res.status(200).json({ message: 'Menu item deleted successfully' });
        } catch (error) {
            return next(new HttpError('Failed to delete menu item', 500));
        }
    }
};

module.exports = menuItemController;
