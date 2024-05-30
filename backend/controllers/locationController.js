const User = require('../models/user');
const HttpError = require('../models/http-error');

const locationController = {
    // Retrieves a user's location
    getUserLocation: async (req, res, next) => {
        const userId = req.params.id;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return next(new HttpError('User not found', 404));
            }

            // Retrieve and send user's location data
            res.status(200).json({ location: user.location });
        } catch (error) {
            console.error('Failed to get user location:', error);
            return next(new HttpError('Failed to get user location', 500));
        }
    },

    // Updates user's stored location
    updateUserLocation: async (req, res, next) => {
        const userId = req.params.id;
        const { latitude, longitude, address } = req.body;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return next(new HttpError('User not found', 404));
            }

            // Update user's location
            user.location = { latitude, longitude, address };
            await user.save();

            res.status(200).json({ message: 'User location updated successfully', location: user.location });
        } catch (error) {
            console.error('Failed to get user location:', error);
            return next(new HttpError('Failed to update user location', 500));
        }
    },

    // Adds a new location to the user's profile
    addUserLocation: async (req, res, next) => {
        const userId = req.params.id;
        const { latitude, longitude, address } = req.body;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return next(new HttpError('User not found', 404));
            }

            // Add the new location to the user's profile
            user.locations.push({ latitude, longitude, address });
            await user.save();

            res.status(201).json({ message: 'Location added successfully', locations: user.locations });
        } catch (error) {
            console.error('Failed to get user location:', error);
            return next(new HttpError('Failed to add location', 500));
        }
    }
};

module.exports = locationController;
