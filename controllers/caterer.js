const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Caterer = require('../models/Caterer');

// @desc    Get all caterers
// @route   GET /api/caterers
// @access  Public
exports.getCaterers = asyncHandler(async (req, res, next) => {
	try {
		const caterers = await Caterer.find();
		res.status(200).json({ success: true, data: caterers });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single caterer
// @route   GET /api/caterers/:id
// @access  Public
exports.getCaterer = asyncHandler(async (req, res, next) => {
	try {
		const caterer = await Caterer.findById(req.params.id);
		if (!caterer) {
			return next(new errorResponse(`Caterer not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: caterer });
	} catch (err) {
		next(err);
	}
});

// @desc    Create caterer
// @route   POST /api/caterers
// @access  Private
exports.createCaterer = asyncHandler(async (req, res, next) => {
	try {
		const caterer = await Caterer.create(req.body);
		res.status(201).json({ success: true, data: caterer });
	} catch (err) {
		next(err);
	}
});

// @desc    Update caterer
// @route   PUT /api/caterers/:id
// @access  Private
exports.updateCaterer = asyncHandler(async (req, res, next) => {
	try {
		const caterer = await Caterer.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!caterer) {
			return next(new errorResponse(`Caterer not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: caterer });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete caterer
// @route   DELETE /api/caterers/:id
// @access  Private
exports.deleteCaterer = asyncHandler(async (req, res, next) => {
	try {
		const caterer = await Caterer.findByIdAndDelete(req.params.id);
		if (!caterer) {
			return next(new errorResponse(`Caterer not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
