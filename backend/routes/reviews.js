const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews_controller');

router.get('/reviews', reviewsController.getAllReviews);
router.get('/reviews/all', reviewsController.getAllReviewsAdmin);
router.post('/reviews', reviewsController.createReview);
router.put('/reviews/:id', reviewsController.updateReview);
router.patch('/reviews/:id/approve', reviewsController.approveReview);
router.patch('/reviews/:id/reject', reviewsController.rejectReview);
router.delete('/reviews/:id', reviewsController.deleteReview);

module.exports = router;
