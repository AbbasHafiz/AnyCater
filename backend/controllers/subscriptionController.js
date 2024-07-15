const SubscriptionPackage = require('../models/subscription');
const SubscriptionAssignment = require('../models/subscriptionAssignment');
const CateringOwner = require('../models/cateringOwner');
const PaymentGateway = require('../services/paymentGateway');
const HttpError = require('../models/http-error');

const subscriptionController = {
  createSubscriptionPackage: async (req, res, next) => {
    const { name, description, price } = req.body;

    try {
      const newSubscriptionPackage = new SubscriptionPackage({ name, description, price });
      await newSubscriptionPackage.save();

      res.status(201).json({ message: 'Subscription package created successfully', subscriptionPackage: newSubscriptionPackage });
    } catch (error) {
      next(new HttpError('Failed to create subscription package', 500));
    }
  },
  subscribeCateringOwner: async (req, res, next) => {
    const { ownerId, packageId, paymentMethod } = req.body;

    try {
      const subscriptionPackage = await SubscriptionPackage.findById(packageId);
      if (!subscriptionPackage) {
        return next(new HttpError('Subscription package not found', 404));
      }

      // Use your PaymentGateway class to process the payment
      const paymentResult = await PaymentGateway.processPayment(paymentMethod, subscriptionPackage.price);

      if (!paymentResult.success) {
        return next(new HttpError('Payment failed', 400));
      }

      const existingAssignment = await SubscriptionAssignment.findOne({ owner: ownerId, package: packageId });
      if (existingAssignment) {
        return next(new HttpError('Subscription already assigned to the owner', 400));
      }

      const newAssignment = new SubscriptionAssignment({ owner: ownerId, package: packageId });
      await newAssignment.save();

      res.status(201).json({ message: 'Subscription assigned successfully', assignment: newAssignment });
    } catch (error) {
      next(new HttpError('Failed to subscribe catering owner', 500));
    }
  },

  getAllSubscriptionPackages: async (req, res, next) => {
    try {
      const subscriptionPackages = await SubscriptionPackage.find();
      res.status(200).json({ subscriptionPackages });
    } catch (error) {
      next(new HttpError('Failed to fetch subscription packages', 500));
    }
  },

  assignSubscriptionPackage: async (req, res, next) => {
    const { ownerId, packageId, paymentMethod } = req.body;

    try {
      const subscriptionPackage = await SubscriptionPackage.findById(packageId);
      if (!subscriptionPackage) {
        return next(new HttpError('Subscription package not found', 404));
      }

      const existingAssignment = await SubscriptionAssignment.findOne({ owner: ownerId, package: packageId });
      if (existingAssignment) {
        return next(new HttpError('Subscription already assigned to the owner', 400));
      }

      // Process payment before assigning subscription
      const paymentAmount = subscriptionPackage.price;
      const paymentSuccess = PaymentGateway.processPayment(paymentAmount, paymentMethod);

      if (!paymentSuccess) {
        return next(new HttpError('Payment processing failed', 500));
      }

      const newAssignment = new SubscriptionAssignment({ owner: ownerId, package: packageId });
      await newAssignment.save();

      // Activate the assigned subscription in the CateringOwner model
      await CateringOwner.findByIdAndUpdate(ownerId, { activeSubscription: newAssignment._id });

      res.status(201).json({ message: 'Subscription assigned successfully', assignment: newAssignment });
    } catch (error) {
      next(new HttpError('Failed to assign subscription package', 500));
    }
  },

  getActiveSubscription: async (req, res, next) => {
    const ownerId = req.params.ownerId;

    try {
      const activeAssignment = await SubscriptionAssignment.findOne({ owner: ownerId, isActive: true });

      if (!activeAssignment) {
        return res.status(200).json({ message: 'No active subscription found', activeSubscription: null });
      }

      const subscriptionPackage = await SubscriptionPackage.findById(activeAssignment.package);
      res.status(200).json({ activeSubscription: subscriptionPackage });
    } catch (error) {
      next(new HttpError('Failed to get active subscription', 500));
    }
  },
};

module.exports = subscriptionController;
