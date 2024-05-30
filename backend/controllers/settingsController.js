// controllers/settingsController.js
const Settings = require('../models/siteSettings');
const HttpError = require('../models/http-error');

const settingsController = {
  getSettings: async (req, res, next) => {
    try {
      const settings = await Settings.findOne();
      res.status(200).json({ settings });
    } catch (error) {
      next(new HttpError('Failed to fetch settings', 500));
    }
  },

  updateSettings: async (req, res, next) => {
    const { siteTitle, logoUrl, banners, navbar, footer } = req.body;

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
      }

      await settings.save();

      res.status(200).json({ message: 'Settings updated successfully', settings });
    } catch (error) {
      next(new HttpError('Failed to update settings', 500));
    }
  },
};

module.exports = settingsController;
