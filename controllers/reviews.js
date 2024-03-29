const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
	try {
		const reviews = await Review.find();
		res.status(200).json({ success: true, data: reviews });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
	try {
		const review = await Review.findById(req.params.id);
		if (!review) {
			return next(new errorResponse(`Review not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: review });
	} catch (err) {
		next(err);
	}
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
	try {
		const review = await Review.create(req.body);
		res.status(201).json({ success: true, data: review });
	} catch (err) {
		next(err);
	}
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
	try {
		const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!review) {
			return next(new errorResponse(`Review not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: review });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
	try {
		const review = await Review.findByIdAndDelete(req.params.id);
		if (!review) {
			return next(new errorResponse(`Review not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
