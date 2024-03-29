const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Entertainment = require('../models/Entertainment');

// @desc    Get all entertainments
// @route   GET /api/entertainments
// @access  Public
exports.getEntertainments = asyncHandler(async (req, res, next) => {
	try {
		const entertainments = await Entertainment.find();
		res.status(200).json({ success: true, data: entertainments });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single entertainment
// @route   GET /api/entertainments/:id
// @access  Public
exports.getEntertainment = asyncHandler(async (req, res, next) => {
	try {
		const entertainment = await Entertainment.findById(req.params.id);
		if (!entertainment) {
			return next(new errorResponse(`Entertainment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: entertainment });
	} catch (err) {
		next(err);
	}
});

// @desc    Create entertainment
// @route   POST /api/entertainments
// @access  Private
exports.createEntertainment = asyncHandler(async (req, res, next) => {
	try {
		const entertainment = await Entertainment.create(req.body);
		res.status(201).json({ success: true, data: entertainment });
	} catch (err) {
		next(err);
	}
});

// @desc    Update entertainment
// @route   PUT /api/entertainments/:id
// @access  Private
exports.updateEntertainment = asyncHandler(async (req, res, next) => {
	try {
		const entertainment = await Entertainment.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!entertainment) {
			return next(new errorResponse(`Entertainment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: entertainment });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete entertainment
// @route   DELETE /api/entertainments/:id
// @access  Private
exports.deleteEntertainment = asyncHandler(async (req, res, next) => {
	try {
		const entertainment = await Entertainment.findByIdAndDelete(req.params.id);
		if (!entertainment) {
			return next(new errorResponse(`Entertainment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
