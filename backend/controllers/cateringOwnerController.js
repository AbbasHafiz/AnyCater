const CateringOwner = require('../models/cateringOwner');
const User = require('../models/user');
const CateringShop = require('../models/cateringShop');
const HttpError = require('../models/http-error');

const cateringOwnerController = {
    createCateringOwner: async (req, res, next) => {
        const { userId, cateringShopId } = req.body;

        try {
            const user = await User.findById(userId);
            const cateringShop = await CateringShop.findById(cateringShopId);

            if (!user || !cateringShop) {
                return next(new HttpError('User or CateringShop not found', 404));
            }

            const existingCateringOwner = await CateringOwner.findOne({ user: userId, cateringShop: cateringShopId });

            if (existingCateringOwner) {
                return next(new HttpError('CateringOwner already exists', 400));
            }

            const newCateringOwner = new CateringOwner({ user: userId, cateringShop: cateringShopId });
            await newCateringOwner.save();

            res.status(201).json({ message: 'CateringOwner created successfully', cateringOwner: newCateringOwner });
        } catch (error) {
            next(new HttpError('Failed to create CateringOwner', 500));
        }
    },
    // Add other CateringOwner controller actions as needed
};

module.exports = cateringOwnerController;
