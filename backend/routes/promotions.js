const express = require('express');
const router = express.Router();
const promotionsController = require('../controllers/promotions_controller');

// Public: lấy promotions đang active
router.get('/promotions', promotionsController.getActivePromotions);
// Admin: lấy tất cả
router.get('/promotions/all', promotionsController.getAllPromotions);
// CRUD (admin protected — sẽ thêm middleware sau)
router.post('/promotions', promotionsController.createPromotion);
router.put('/promotions/:id', promotionsController.updatePromotion);
router.delete('/promotions/:id', promotionsController.deletePromotion);

module.exports = router;
