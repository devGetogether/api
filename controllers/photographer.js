const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Photographer = require('../models/Photographer');
const User = require('../models/User');

// @desc    Get all photographers
// @route   GET /api/photographers
// @access  Public
exports.getAllPhotographers = asyncHandler(async (req, res, next) => {
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
			return next(new errorResponse(`Photographer not found`, 404));
		}
		res.status(200).json({ success: true, data: photographer, message: 'Photographer found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create photographer
// @route   POST /api/photographers
// @access  Private
exports.createNewPhotographer = asyncHandler(async (req, res, next) => {
	req.body.userID = req.user.id;

	// check for published event planner
	const publishedPhotographer = await Photographer.findOne({ user: req.user.id });

	// if there is a published event planner and the user is not an admin
	if (publishedPhotographer) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Photographer Service registered.' });
	}
	try {
		const photographer = await Photographer.create(req.body);

		// add the photographer role to the user roles array
		const userRoles = [...req.user.role, 'photographer'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res
			.status(201)
			.json({ success: true, data: photographer, message: 'Photographer created successfully' });
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
