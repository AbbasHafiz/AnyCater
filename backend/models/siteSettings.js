// models/settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteTitle: { type: String, required: true },
  logoUrl: String,
  banners: [String],
  navbar: String,
  footer: String,
  // Add other fields as needed
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
