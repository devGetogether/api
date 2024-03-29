const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Videographer = require('../models/Videographer');

// @desc    Get all videographers
// @route   GET /api/videographers
// @access  Public
exports.getVideographers = asyncHandler(async (req, res, next) => {
	try {
		const videographers = await Videographer.find();
		res.status(200).json({ success: true, data: videographers });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single videographer
// @route   GET /api/videographers/:id
// @access  Public
exports.getVideographer = asyncHandler(async (req, res, next) => {
	try {
		const videographer = await Videographer.findById(req.params.id);
		if (!videographer) {
			return next(new errorResponse(`Videographer not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: videographer });
	} catch (err) {
		next(err);
	}
});

// @desc    Create videographer
// @route   POST /api/videographers
// @access  Private
exports.createVideographer = asyncHandler(async (req, res, next) => {
	try {
		const videographer = await Videographer.create(req.body);
		res.status(201).json({ success: true, data: videographer });
	} catch (err) {
		next(err);
	}
});

// @desc    Update videographer
// @route   PUT /api/videographers/:id
// @access  Private
exports.updateVideographer = asyncHandler(async (req, res, next) => {
	try {
		const videographer = await Videographer.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!videographer) {
			return next(new errorResponse(`Videographer not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: videographer });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete videographer
// @route   DELETE /api/videographers/:id
// @access  Private
exports.deleteVideographer = asyncHandler(async (req, res, next) => {
	try {
		const videographer = await Videographer.findByIdAndDelete(req.params.id);
		if (!videographer) {
			return next(new errorResponse(`Videographer not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
