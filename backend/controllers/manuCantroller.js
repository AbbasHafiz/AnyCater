const Menu = require('../models/menu');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const menuController = {
    createMenu: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError('Invalid inputs passed, please check your data.', 422));
        }

        const { name, description, cateringShopId } = req.body;

        try {
            // Check if the catering shop exists
            const cateringShop = await CateringShop.findById(cateringShopId);
            if (!cateringShop) {
                return next(new HttpError('Could not find the catering shop for provided ID.', 404));
            }

            const newMenu = new Menu({ name, description, cateringShop: cateringShopId });
            await newMenu.save();

            res.status(201).json({ message: 'Menu created successfully', menu: newMenu });
        } catch (error) {
            return next(new HttpError('Failed to create menu', 500));
        }
    },

    updateMenu: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError('Invalid inputs passed, please check your data.', 422));
        }

        const menuId = req.params.id;
        const { name, description } = req.body;

        try {
            const updatedMenu = await Menu.findByIdAndUpdate(menuId, { name, description }, { new: true });

            if (!updatedMenu) {
                return next(new HttpError('Menu not found', 404));
            }

            res.status(200).json({ message: 'Menu updated successfully', menu: updatedMenu });
        } catch (error) {
            return next(new HttpError('Failed to update menu', 500));
        }
    },

    getMenuByCateringShopId: async (req, res, next) => {
        const cateringShopId = req.params.id;

        try {
            const menus = await Menu.find({ cateringShop: cateringShopId });

            if (!menus || menus.length === 0) {
                return next(new HttpError('No menus found for the provided catering shop ID.', 404));
            }

            res.status(200).json({ menus });
        } catch (error) {
            return next(new HttpError('Failed to fetch menus', 500));
        }
    },

    deleteMenu: async (req, res, next) => {
        const menuId = req.params.id;

        try {
            const deletedMenu = await Menu.findByIdAndDelete(menuId);

            if (!deletedMenu) {
                return next(new HttpError('Menu not found', 404));
            }

            res.status(200).json({ message: 'Menu deleted successfully' });
        } catch (error) {
            return next(new HttpError('Failed to delete menu', 500));
        }
    }
};

module.exports = menuController;
