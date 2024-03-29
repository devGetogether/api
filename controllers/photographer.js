const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Photographer = require('../models/Photographer');

// @desc    Get all photographers
// @route   GET /api/photographers
// @access  Public
exports.getPhotographers = asyncHandler(async (req, res, next) => {
	try {
		const photographers = await Photographer.find();
		res.status(200).json({ success: true, data: photographers });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single photographer
// @route   GET /api/photographers/:id
// @access  Public
exports.getPhotographer = asyncHandler(async (req, res, next) => {
	try {
		const photographer = await Photographer.findById(req.params.id);
		if (!photographer) {
			return next(new errorResponse(`Photographer not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: photographer });
	} catch (err) {
		next(err);
	}
});

// @desc    Create photographer
// @route   POST /api/photographers
// @access  Private
exports.createPhotographer = asyncHandler(async (req, res, next) => {
	try {
		const photographer = await Photographer.create(req.body);
		res.status(201).json({ success: true, data: photographer });
	} catch (err) {
		next(err);
	}
});

// @desc    Update photographer
// @route   PUT /api/photographers/:id
// @access  Private
exports.updatePhotographer = asyncHandler(async (req, res, next) => {
	try {
		const photographer = await Photographer.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!photographer) {
			return next(new errorResponse(`Photographer not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: photographer });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete photographer
// @route   DELETE /api/photographers/:id
// @access  Private
exports.deletePhotographer = asyncHandler(async (req, res, next) => {
	try {
		const photographer = await Photographer.findByIdAndDelete(req.params.id);
		if (!photographer) {
			return next(new errorResponse(`Photographer not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
