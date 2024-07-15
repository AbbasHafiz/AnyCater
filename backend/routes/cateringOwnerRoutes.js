const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const cateringOwnerController = require('../controllers/cateringOwnerController');
const subscriptionController = require('../controllers/subscriptionController');

// Create a new CateringOwner
router.post(
    '/create',
    [
      check('userId').not().isEmpty(),
      check('cateringShopId').not().isEmpty(),
    ],
    cateringOwnerController.createCateringOwner
  );



  module.exports = router;