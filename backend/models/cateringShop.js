const mongoose = require("mongoose");

const cateringShopSchema = new mongoose.Schema({
  resturentname: {
    type: String,
    required: true,
  },
  restaurantAddress: {
    type: String,
    required: true,
  },
  phoneNumber: { type: String },
  ownerName: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
   
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    // Add any other configurations as needed
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      // Add any other configurations as needed
    },
  ],
  location: {
    // Define your location details as needed
    type: String,
  },
  rentalItems: [{ type: mongoose.Types.ObjectId, ref: "RentalItem" }],
  cuisine: { type: String },
  ratings: { type: Number, default: 0 },
  payment: {
    balance: {
      type: Number,
      default: 0,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    // Add other payment-related fields as needed
  },
});

const CateringShop = mongoose.model("CateringShop", cateringShopSchema);

module.exports = CateringShop;
