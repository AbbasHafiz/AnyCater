const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { check } = require('express-validator');

// Place an order
router.post(
    '/place-order',
    [
        // Add validation using express-validator if required
        check('cateringShopId').not().isEmpty(),
        check('userId').not().isEmpty(),
        check('items').isArray(),
        check('totalPrice').isNumeric(),
        check('deliveryAddress').not().isEmpty(),
    ],
    orderController.placeOrder
);

// Accept an order
router.patch('/accept-order/:id', orderController.acceptOrder);

// Update order status
router.patch('/update-order-status/:id', orderController.updateOrderStatus);

// Get orders for a specific catering shop
router.get('/catering-shop-orders/:id', orderController.getOrdersForCateringShop);

module.exports = router;
