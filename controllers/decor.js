const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Decor = require('../models/Decor');
const User = require('../models/User');

// @desc    Get all decor
// @route   GET /api/decor
// @access  Public
exports.getAllDecor = asyncHandler(async (req, res, next) => {
	try {
		const decor = await Decor.find();
		res.status(200).json({ success: true, data: decor });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single decor
// @route   GET /api/decor/:id
// @access  Public
exports.getDecor = asyncHandler(async (req, res, next) => {
	try {
		const decor = await Decor.findById(req.params.id);
		if (!decor) {
			return next(new errorResponse(`Decor service provider not found`, 404));
		}
		res.status(200).json({ success: true, data: decor, message: 'Decor service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create decor
// @route   POST /api/decor
// @access  Private
exports.createNewDecor = asyncHandler(async (req, res, next) => {
	// check User
	req.body.userID = req.user.id;

	// check if there is alread a decor service for the user
	const existingDecor = await Decor.findOne({ userID: req.user.id });

	if (existingDecor) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Decor Service registered.' });
	}

	try {
		const decor = await Decor.create(req.body);

		// add the decor role to the user roles array
		const userRoles = [...req.user.role, 'decor'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });
		res
			.status(201)
			.json({ success: true, data: decor, message: 'Decor service created successfully' });
	} catch (err) {
		next(err);
	}
});

// @desc    Update decor
// @route   PUT /api/decor/:id
// @access  Private
exports.updateDecor = asyncHandler(async (req, res, next) => {
	try {
		const decor = await Decor.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!decor) {
			return next(new errorResponse(`Decor not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: decor });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete decor
// @route   DELETE /api/decor/:id
// @access  Private
exports.deleteDecor = asyncHandler(async (req, res, next) => {
	try {
		const decor = await Decor.findByIdAndDelete(req.params.id);
		if (!decor) {
			return next(new errorResponse(`Decor not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
