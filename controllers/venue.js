const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Venue = require('../models/Venue');
const User = require('../models/User');

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
exports.getAllVenues = asyncHandler(async (req, res, next) => {
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
			return next(new errorResponse(`Venue service provider not found`, 404));
		}
		res.status(200).json({ success: true, data: venue, message: 'Venue service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create venue
// @route   POST /api/venues
// @access  Private
exports.createNewVenue = asyncHandler(async (req, res, next) => {
	req.body.userID = req.user.id;

	// check for published event planner
	const publishedVenue = await Venue.findOne({ user: req.user.id });

	// if there is a published event planner and the user is not an admin
	if (publishedVenue) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Venue Service registered.' });
	}
	try {
		const venue = await Venue.create(req.body);

		// add the venue role to the user roles array
		const userRoles = [...req.user.role, 'venue'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res
			.status(201)
			.json({ success: true, data: venue, message: 'Venue service created successfully' });
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
