const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Decor = require('../models/Decor');

// @desc    Get all decor
// @route   GET /api/decor
// @access  Public
exports.getDecors = asyncHandler(async (req, res, next) => {
	try {
		const decor = await Decor.find();
		res.status(200).json({ success: true, data: decor });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single decor
// @route   GET /api/decor/:id
// @access  Public
exports.getDecor = asyncHandler(async (req, res, next) => {
	try {
		const decor = await Decor.findById(req.params.id);
		if (!decor) {
			return next(new errorResponse(`Decor not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: decor });
	} catch (err) {
		next(err);
	}
});

// @desc    Create decor
// @route   POST /api/decor
// @access  Private
exports.createDecor = asyncHandler(async (req, res, next) => {
	try {
		const decor = await Decor.create(req.body);
		res.status(201).json({ success: true, data: decor });
	} catch (err) {
		next(err);
	}
});

// @desc    Update decor
// @route   PUT /api/decor/:id
// @access  Private
exports.updateDecor = asyncHandler(async (req, res, next) => {
	try {
		const decor = await Decor.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!decor) {
			return next(new errorResponse(`Decor not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: decor });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete decor
// @route   DELETE /api/decor/:id
// @access  Private
exports.deleteDecor = asyncHandler(async (req, res, next) => {
	try {
		const decor = await Decor.findByIdAndDelete(req.params.id);
		if (!decor) {
			return next(new errorResponse(`Decor not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
