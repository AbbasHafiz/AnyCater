const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const siteSettingsSchema = new Schema({
  siteTitle: { type: String },
  logoUrl: { type: String},
  navbar: { type: String },
  footer: { type: String },
  image: { type: String },
});

module.exports = mongoose.model('Settings', siteSettingsSchema);
