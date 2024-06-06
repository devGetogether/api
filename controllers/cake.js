const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Cake = require('../models/Cake');
const User = require('../models/User');

// @desc    Get all cakes
// @route   GET /api/cakes
// @access  Public
exports.getAllCakes = asyncHandler(async (req, res, next) => {
	try {
		const cakes = await Cake.find();
		res.status(200).json({ success: true, data: cakes });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single cake
// @route   GET /api/cakes/:id
// @access  Public
exports.getCake = asyncHandler(async (req, res, next) => {
	try {
		const cake = await Cake.findById(req.params.id);
		if (!cake) {
			return next(new errorResponse(`Cake service provider not found`, 404));
		}
		res.status(200).json({ success: true, data: cake, message: 'Cake service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create cake
// @route   POST /api/cakes
// @access  Private
exports.createNewCake = asyncHandler(async (req, res, next) => {
	// check User
	req.body.userID = req.user.id;

	// check if there is alread a cake service for the user
	const existingCake = await Cake.findOne({ userID: req.user.id });

	if (existingCake) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Cake Service registered.' });
	}

	try {
		const cake = await Cake.create(req.body);

		// add the cake role to the user roles array
		const userRoles = [...req.user.role, 'cake'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res
			.status(201)
			.json({ success: true, data: cake, message: 'Cake service created successfully' });
	} catch (err) {
		next(err);
	}
});

// @desc    Update cake
// @route   PUT /api/cakes/:id
// @access  Private
exports.updateCake = asyncHandler(async (req, res, next) => {
	try {
		const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!cake) {
			return next(new errorResponse(`Cake not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: cake });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete cake
// @route   DELETE /api/cakes/:id
// @access  Private
exports.deleteCake = asyncHandler(async (req, res, next) => {
	try {
		const cake = await Cake.findByIdAndDelete(req.params.id);
		if (!cake) {
			return next(new errorResponse(`Cake not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
