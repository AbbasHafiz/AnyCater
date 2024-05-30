const CateringShop = require('../models/cateringShop');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const RentalItem = require('../models/rentalItems');
const cateringShopController = {
    getAllCateringShops: async (req, res, next) => {
        try {
            const cateringShops = await CateringShop.find().populate('owner', 'userresturentname');
            res.status(200).json({ cateringShops });
        } catch (error) {
            next(new HttpError('Failed to fetch catering shops', 500));
        }
    },

    getCateringShopById: async (req, res, next) => {
        const cateringShopId = req.params.id;

        try {
            const cateringShop = await CateringShop.findById(cateringShopId).populate('owner', 'userresturentname');

            if (!cateringShop) {
                return next(new HttpError('Catering shop not found', 404));
            }

            res.status(200).json({ cateringShop });
        } catch (error) {
            next(new HttpError('Failed to fetch catering shop', 500));
        }
    },

    createCateringShop : async (req, res, next) => {
        const { resturentname, restaurantAddress, phoneNumber, email, ownerName } = req.body;
      
        try {
          // Check if the owner with the provided email already exists
          let ownerInfo = await User.findOne({ email });
      
          // If the owner doesn't exist, create a new one
          if (!ownerInfo) {
            ownerInfo = new User({
              email,
              roles: ['owner'],
            });
      
            // Save the new owner to the database
            await ownerInfo.save();
          }
      
          // Create new CateringShop
          const newCateringShop = new CateringShop({
            resturentname,
            restaurantAddress,
            phoneNumber,
          //  owner: ownerInfo._id, // Assign the owner's ID to the CateringShop
            ownerName,
          });
      
          await newCateringShop.save();
      
          res.status(201).json({ message: 'Catering shop created successfully', cateringShop: newCateringShop });
        } catch (error) {
          return next(new HttpError('Failed to create catering shop', 500));
        }
      },
    rateCateringShop: async (req, res, next) => {
        const cateringShopId = req.params.id;
        const { rating } = req.body;
    
        try {
            const cateringShop = await CateringShop.findById(cateringShopId);
    
            if (!cateringShop) {
                return next(new HttpError('Catering shop not found', 404));
            }
    
            // Add the new rating to the existing ratings
            cateringShop.ratings.push(rating);
            
            // Calculate the average rating
            const averageRating = cateringShop.ratings.reduce((sum, value) => sum + value, 0) / cateringShop.ratings.length;
    
            cateringShop.ratings = averageRating; // Update the ratings field
    
            await cateringShop.save();
    
            res.status(200).json({ message: 'Catering shop rated successfully', averageRating });
        } catch (error) {
            return next(new HttpError('Failed to rate catering shop', 500));
        }
    },
    updateCateringShop: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError('Invalid inputs passed, please check your data.', 422));
        }

        const cateringShopId = req.params.id;
        const { resturentname, description, location } = req.body;

        try {
            const updatedCateringShop = await CateringShop.findByIdAndUpdate(cateringShopId, { resturentname, description, location }, { new: true });

            if (!updatedCateringShop) {
                return next(new HttpError('Catering shop not found', 404));
            }

            res.status(200).json({ message: 'Catering shop updated successfully', updatedCateringShop });
        } catch (error) {
            return next(new HttpError('Failed to update catering shop', 500));
        }
    },

    deleteCateringShop: async (req, res, next) => {
        const cateringShopId = req.params.id;

        try {
            const deletedCateringShop = await CateringShop.findByIdAndDelete(cateringShopId);

            if (!deletedCateringShop) {
                return next(new HttpError('Catering shop not found', 404));
            }

            res.status(200).json({ message: 'Catering shop deleted successfully' });
        } catch (error) {
            return next(new HttpError('Failed to delete catering shop', 500));
        }
    },
    addRentalItem: async (req, res, next) => {
        const cateringShopId = req.params.id;
        const { resturentname, description, price } = req.body;
    
        try {
          const cateringShop = await CateringShop.findById(cateringShopId);
    
          if (!cateringShop) {
            return next(new HttpError('Catering shop not found', 404));
          }
    
          // Check if the user making the request is the owner of the catering shop
          if (cateringShop.owner.toString() !== req.userData.userId) {
            return next(new HttpError('Unauthorized access', 403));
          }
    
          const newRentalItem = new RentalItem({ resturentname, description, price, cateringShop: cateringShopId });
          await newRentalItem.save();
    
          cateringShop.rentalItems.push(newRentalItem);
          await cateringShop.save();
    
          res.status(201).json({ message: 'Rental item added successfully', rentalItem: newRentalItem });
        } catch (error) {
          return next(new HttpError('Failed to add rental item', 500));
        }
      },
      printReceipt:async (req, res, next) => {
        const orderId = req.params.orderId;
    
        try {
            // Fetch order details
            const order = await Order.findById(orderId);
            if (!order) {
                return next(new HttpError('Order not found', 404));
            }
    
            // Fetch catering shop information
            const cateringShop = await CateringShop.findById(order.cateringShop);
            if (!cateringShop) {
                return next(new HttpError('Catering shop not found', 404));
            }
    
            // Combine order and catering shop information
            const orderDetails = {
                orderId: order._id,
                date: order.date,
                items: order.items, // Adjust as per your schema
                cateringShop: {
                    resturentname: cateringShop.resturentname,
                    location: cateringShop.location,
                    // Add other catering shop details if needed
                },
                // Add other order details as needed
            };
    
            res.status(200).json({ orderDetails });
        } catch (error) {
            next(new HttpError('Failed to fetch order details', 500));
        }
    },
    searchCateringShops: async (req, res, next) => {
        try {
          const { location, cuisine, minRatings } = req.query;
    
          let query = {};
    
          if (location) {
            query.location = { $regex: new RegExp(location, 'i') };
          }
    
          if (cuisine) {
            query.cuisine = { $regex: new RegExp(cuisine, 'i') };
          }
    
          if (minRatings) {
            query.ratings = { $gte: parseInt(minRatings) };
          }
    
          const cateringShops = await CateringShop.find(query);
    
          res.status(200).json({ cateringShops });
        } catch (error) {
          next(new HttpError('Failed to search catering shops', 500));
        }
      },
};

module.exports = cateringShopController;
