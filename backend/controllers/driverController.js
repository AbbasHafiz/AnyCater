const Driver = require('../models/driver');
const Order = require('../models/order');
const HttpError = require('../models/http-error');

const driverController = {
    // Creates a new driver in the system
    createDriver: async (req, res, next) => {
        const { name, contactInformation } = req.body;

        try {
            // Create a new driver
            const newDriver = new Driver({ name, contactInformation, assignedOrders: [] });
            await newDriver.save();

            res.status(201).json({ message: 'Driver added successfully', driver: newDriver });
        } catch (error) {
            return next(new HttpError('Failed to add the driver', 500));
        }
    },

    // Assigns an order to a driver for delivery
    assignOrderToDriver: async (req, res, next) => {
        const driverId = req.params.id;
        const orderId = req.body.orderId;

        try {
            // Find the driver and order
            const driver = await Driver.findById(driverId);
            const order = await Order.findById(orderId);

            // Ensure the driver and order exist
            if (!driver || !order) {
                return next(new HttpError('Driver or order not found', 404));
            }

            // Push the order reference into the driver's assigned orders
            driver.assignedOrders.push(orderId);
            await driver.save();

            res.status(200).json({ message: 'Order assigned to the driver successfully', driver });
        } catch (error) {
            return next(new HttpError('Failed to assign the order to the driver', 500));
        }
    }
};

module.exports = driverController;
