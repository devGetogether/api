const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Venue = require('../models/Venue');

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
exports.getVenues = asyncHandler(async (req, res, next) => {
	try {
		const venues = await Venue.find();
		res.status(200).json({ success: true, data: venues });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single venue
// @route   GET /api/venues/:id
// @access  Public
exports.getVenue = asyncHandler(async (req, res, next) => {
	try {
		const venue = await Venue.findById(req.params.id);
		if (!venue) {
			return next(new errorResponse(`Venue not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: venue });
	} catch (err) {
		next(err);
	}
});

// @desc    Create venue
// @route   POST /api/venues
// @access  Private
exports.createVenue = asyncHandler(async (req, res, next) => {
	try {
		const venue = await Venue.create(req.body);
		res.status(201).json({ success: true, data: venue });
	} catch (err) {
		next(err);
	}
});

// @desc    Update venue
// @route   PUT /api/venues/:id
// @access  Private
exports.updateVenue = asyncHandler(async (req, res, next) => {
	try {
		const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!venue) {
			return next(new errorResponse(`Venue not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: venue });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete venue
// @route   DELETE /api/venues/:id
// @access  Private
exports.deleteVenue = asyncHandler(async (req, res, next) => {
	try {
		const venue = await Venue.findByIdAndDelete(req.params.id);
		if (!venue) {
			return next(new errorResponse(`Venue not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
