const express = require('express');
const router = express.Router();
const cateringShopController = require('../controllers/cateringShopController');
const checkUserRole = require('../middleware/checkRole'); // middleware for checking user roles
const { check } = require('express-validator');

// Routes for catering shop operations
router.post('/create', cateringShopController.createCateringShop);
router.put('/update/:id', checkUserRole('admin'), cateringShopController.updateCateringShop);
router.get('/getbyid/:id', cateringShopController.getCateringShopById);
router.delete('/delete/:id', checkUserRole('admin'), cateringShopController.deleteCateringShop);
router.get('/printReceipt/:orderId', cateringShopController.printReceipt);
router.post('/:id/addRentalItem', cateringShopController.addRentalItem);
router.get('/search', cateringShopController.searchCateringShops);
router.get('/catering-shops/:id', cateringShopController.getCateringShopById);

// Rate a catering shop
router.post('/catering-shops/:id/rate' , cateringShopController.rateCateringShop);

// ... (Other routes remain unchanged)
module.exports = router;
