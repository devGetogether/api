const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const MakeUpService = require('../models/MakeUpService');

// @desc    Get all make up services
// @route   GET /api/makeup
// @access  Public
exports.getMakeUpServices = asyncHandler(async (req, res, next) => {
	try {
		const makeUpServices = await MakeUpService.find();
		res.status(200).json({ success: true, data: makeUpServices });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single make up service
// @route   GET /api/makeup/:id
// @access  Public
exports.getMakeUpService = asyncHandler(async (req, res, next) => {
	try {
		const makeUpService = await MakeUpService.findById(req.params.id);
		if (!makeUpService) {
			return next(new errorResponse(`Make up service not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: makeUpService });
	} catch (err) {
		next(err);
	}
});

// @desc    Create make up service
// @route   POST /api/makeup
// @access  Private
exports.createMakeUpService = asyncHandler(async (req, res, next) => {
	try {
		const makeUpService = await MakeUpService.create(req.body);
		res.status(201).json({ success: true, data: makeUpService });
	} catch (err) {
		next(err);
	}
});

// @desc    Update make up service
// @route   PUT /api/makeup/:id
// @access  Private
exports.updateMakeUpService = asyncHandler(async (req, res, next) => {
	try {
		const makeUpService = await MakeUpService.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!makeUpService) {
			return next(new errorResponse(`Make up service not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: makeUpService });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete make up service
// @route   DELETE /api/makeup/:id
// @access  Private
exports.deleteMakeUpService = asyncHandler(async (req, res, next) => {
	try {
		const makeUpService = await MakeUpService.findByIdAndDelete(req.params.id);
		if (!makeUpService) {
			return next(new errorResponse(`Make up service not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
