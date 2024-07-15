const Settings = require('../models/siteSettings');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const settingsController = {
  // GET settings
  getSettings: async (req, res, next) => {
    try {
      const settings = await Settings.findOne();
      res.status(200).json({ settings });
    } catch (error) {
      next(new HttpError('Failed to fetch settings', 500));
    }
  },

  // PUT update settings
  updateSettings: async (req, res, next) => {
    const { siteTitle, logoUrl, banners, navbar, footer } = req.body;
    const image = req.file;
    try {
      let settings = await Settings.findOne();

      if (!settings) {
        settings = new Settings({ siteTitle, logoUrl, banners, navbar, footer });
      } else {
        settings.siteTitle = siteTitle;
        settings.logoUrl = logoUrl;
        settings.banners = banners;
        settings.navbar = navbar;
        settings.footer = footer;
        settings.image = image.path;
      }

      await settings.save();

      res.status(200).json({ message: 'Settings updated successfully', settings });
    } catch (error) {
      next(new HttpError('Failed to update settings', 500));
    }
  },

  // GET slider images
  getSliderImages: async (req, res, next) => {
    try {
      const settings = await Settings.findOne();
      if (!settings) {
        return next(new HttpError('Settings not found.', 404));
      }
      res.status(200).json({ images: settings.banners });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch slider images.' });
    }
  },

  // POST update slider image
  updateSlider: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const imagePath = req.file; // Accessing the file path
    console.log('path',imagePath);
    if (!imagePath) {
      return next(new HttpError('No file provided.', 422));
    }

    try { 
      let settings = await Settings.findOne();

      if (!settings) {
        settings = new Settings({ sliderImages: [imagePath] });
      } else {
        settings.sliderImages.push(imagePath);
      }

      await settings.save();
      res.status(201).json({ message: 'Image uploaded and slider updated.', imagePath });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update slider images.' });
    }
  }
};

module.exports = settingsController;
