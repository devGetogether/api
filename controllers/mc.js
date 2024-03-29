const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const MC = require('../models/MC');

// @desc    Get all MCs
// @route   GET /api/mcs
// @access  Public
exports.getMCs = asyncHandler(async (req, res, next) => {
	try {
		const mcs = await MC.find();
		res.status(200).json({ success: true, data: mcs });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single MC
// @route   GET /api/mcs/:id
// @access  Public
exports.getMC = asyncHandler(async (req, res, next) => {
	try {
		const mc = await MC.findById(req.params.id);
		if (!mc) {
			return next(new errorResponse(`MC not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: mc });
	} catch (err) {
		next(err);
	}
});

// @desc    Create MC
// @route   POST /api/mcs
// @access  Private
exports.createMC = asyncHandler(async (req, res, next) => {
	try {
		const mc = await MC.create(req.body);
		res.status(201).json({ success: true, data: mc });
	} catch (err) {
		next(err);
	}
});

// @desc    Update MC
// @route   PUT /api/mcs/:id
// @access  Private
exports.updateMC = asyncHandler(async (req, res, next) => {
	try {
		const mc = await MC.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!mc) {
			return next(new errorResponse(`MC not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: mc });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete MC
// @route   DELETE /api/mcs/:id
// @access  Private
exports.deleteMC = asyncHandler(async (req, res, next) => {
	try {
		const mc = await MC.findByIdAndDelete(req.params.id);
		if (!mc) {
			return next(new errorResponse(`MC not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
