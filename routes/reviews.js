const express = require('express');
const Reviews = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllReviews,
	getReview,
	createNewReview,
	updateReview,
	deleteReview,
} = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

// Get all reviews
router.route('/').get(
	advancedResults(Reviews, [
		{
			path: 'userId',
			select: 'firstName lastName',
		},
	]),
	getAllReviews
);

// Create new review
router.route('/').post(protect, createNewReview);

router
	.route('/:id')
	// Get review
	.get(protect, getReview)
	// Update review
	.put(protect, updateReview)
	// Delete review
	.delete(protect, authorize('admin'), deleteReview);

module.exports = router;
