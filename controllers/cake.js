const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Cake = require('../models/cake');

// @desc    Get all cakes
// @route   GET /api/cakes
// @access  Public
exports.getCakes = asyncHandler(async (req, res, next) => {
	try {
		const cakes = await Cake.find();
		res.status(200).json({ success: true, data: cakes });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single cake
// @route   GET /api/cakes/:id
// @access  Public
exports.getCake = asyncHandler(async (req, res, next) => {
	try {
		const cake = await Cake.findById(req.params.id);
		if (!cake) {
			return next(new errorResponse(`Cake not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: cake });
	} catch (err) {
		next(err);
	}
});

// @desc    Create cake
// @route   POST /api/cakes
// @access  Private
exports.createCake = asyncHandler(async (req, res, next) => {
	try {
		const cake = await Cake.create(req.body);
		res.status(201).json({ success: true, data: cake });
	} catch (err) {
		next(err);
	}
});

// @desc    Update cake
// @route   PUT /api/cakes/:id
// @access  Private
exports.updateCake = asyncHandler(async (req, res, next) => {
	try {
		const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!cake) {
			return next(new errorResponse(`Cake not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: cake });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete cake
// @route   DELETE /api/cakes/:id
// @access  Private
exports.deleteCake = asyncHandler(async (req, res, next) => {
	try {
		const cake = await Cake.findByIdAndDelete(req.params.id);
		if (!cake) {
			return next(new errorResponse(`Cake not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
