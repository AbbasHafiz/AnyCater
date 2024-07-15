const Order = require('../models/order');
const CateringShop = require('../models/cateringShop');
const HttpError = require('../models/http-error');
const PaymentGateway = require('../services/paymentGateway');
const paymentGateway = new PaymentGateway('your_payment_gateway_api_key');
const orderController = {
    placeOrder: async (req, res, next) => {
        const { userId, cateringShopId, items, deliveryAddress, paymentMethod } = req.body;
    
        try {
          // Validate items, cateringShopId, and other required fields
    
          // Fetch catering shop to calculate total price
          const cateringShop = await CateringShop.findById(cateringShopId).populate('menu.items');
    
          if (!cateringShop) {
            return next(new HttpError('Catering shop not found', 404));
          }
    
          // Calculate total price based on selected items
          const totalPrice = items.reduce((total, itemId) => {
            const selectedItem = cateringShop.menu.items.find(item => item.id === itemId);
            return total + selectedItem.price;
          }, 0);
    
          // Process payment using the specified payment method
          const paymentResult = await paymentGateway.processPayment(paymentMethod);
    
          // Check if payment was successful
          if (paymentResult.success) {
            // Create a new order
            const newOrder = new Order({
              user: userId,
              cateringShop: cateringShopId,
              items,
              totalPrice,
              status: 'Pending',
              deliveryAddress,
              paymentMethod,
            });
    
            // Save the order to the database
            await newOrder.save();
    
            // Update catering shop's order list
            cateringShop.orders.push(newOrder);
            await cateringShop.save();
    
            // Respond with success message and order details
            res.status(200).json({ message: 'Order placed successfully', order: newOrder });
          } else {
            // Handle payment failure
            res.status(500).json({ message: 'Payment failed', error: paymentResult.error });
          }
        } catch (error) {
          // Handle other errors
          next(error);
        }
      },

    acceptOrder: async (req, res, next) => {
        const orderId = req.params.id;

        try {
            const order = await Order.findById(orderId);

            if (!order) {
                return next(new HttpError('Order not found', 404));
            }

            // Update the order status to 'Accepted' or another status as needed
            order.status = 'Accepted';
            await order.save();

            res.status(200).json({ message: 'Order accepted successfully', order });
        } catch (error) {
            return next(new HttpError('Failed to accept the order', 500));
        }
    },

    updateOrderStatus: async (req, res, next) => {
        const orderId = req.params.id;
        const { status } = req.body;

        try {
            const order = await Order.findById(orderId);

            if (!order) {
                return next(new HttpError('Order not found', 404));
            }

            // Update the order status to the provided status
            order.status = status;
            await order.save();

            res.status(200).json({ message: 'Order status updated successfully', order });
        } catch (error) {
            return next(new HttpError('Failed to update order status', 500));
        }
    },

    getOrdersForCateringShop: async (req, res, next) => {
        const cateringShopId = req.params.id;

        try {
            const orders = await Order.find({ cateringShop: cateringShopId });

            if (!orders || orders.length === 0) {
                return next(new HttpError('No orders found for the provided catering shop ID.', 404));
            }

            res.status(200).json({ orders });
        } catch (error) {
            return next(new HttpError('Failed to fetch orders for the catering shop', 500));
        }
    },

};

module.exports = orderController;
