const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Caterer = require('../models/Caterer');
const User = require('../models/User');

// @desc    Get all caterers
// @route   GET /api/caterers
// @access  Public
exports.getAllCaterers = asyncHandler(async (req, res, next) => {
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
			return next(new errorResponse(`Caterer service provider not found`, 404));
		}
		res.status(200).json({ success: true, data: caterer, message: 'Caterer service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create caterer
// @route   POST /api/caterers
// @access  Private
exports.createNewCaterer = asyncHandler(async (req, res, next) => {
	// check User
	console.log(req.user);
	req.body.userID = req.user.id;

	// check if there is alread a caterer service for the user
	const existingCaterer = await Caterer.findOne({ userID: req.user.id });

	if (existingCaterer) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Caterer Service registered.' });
	}
	try {
		const caterer = await Caterer.create(req.body);

		// add the caterer role to the user roles array
		const userRoles = [...req.user.role, 'caterer'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res
			.status(201)
			.json({ success: true, data: caterer, message: 'Caterer service created successfully' });
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
