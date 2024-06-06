const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Entertainment = require('../models/Entertainment');
const User = require('../models/User');

// @desc    Get all entertainments
// @route   GET /api/entertainments
// @access  Public
exports.getAllEntertainment = asyncHandler(async (req, res, next) => {
	try {
		const entertainments = await Entertainment.find();
		res.status(200).json({ success: true, data: entertainments });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single entertainment
// @route   GET /api/entertainments/:id
// @access  Public
exports.getEntertainment = asyncHandler(async (req, res, next) => {
	try {
		const entertainment = await Entertainment.findById(req.params.id);
		if (!entertainment) {
			return next(new errorResponse(`Entertainment service provider not found`, 404));
		}
		res.status(200).json({ success: true, data: entertainment, message: 'Entertainment service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create entertainment
// @route   POST /api/entertainments
// @access  Private
exports.createNewEntertainment = asyncHandler(async (req, res, next) => {
	// check User
	req.body.userID = req.user.id;

	// check if there is alread a entertainment service for the user
	const existingEntertainment = await Entertainment.findOne({ userID: req.user.id });

	if (existingEntertainment) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Entertainment Service registered.' });
	}

	try {
		const entertainment = await Entertainment.create(req.body);

		// add the entertainment role to the user roles array
		const userRoles = [...req.user.role, 'entertainment'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res.status(201).json({
			success: true,
			data: entertainment,
			message: 'Entertainment service created successfully',
		});
	} catch (err) {
		next(err);
	}
});

// @desc    Update entertainment
// @route   PUT /api/entertainments/:id
// @access  Private
exports.updateEntertainment = asyncHandler(async (req, res, next) => {
	try {
		const entertainment = await Entertainment.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!entertainment) {
			return next(new errorResponse(`Entertainment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: entertainment });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete entertainment
// @route   DELETE /api/entertainments/:id
// @access  Private
exports.deleteEntertainment = asyncHandler(async (req, res, next) => {
	try {
		const entertainment = await Entertainment.findByIdAndDelete(req.params.id);
		if (!entertainment) {
			return next(new errorResponse(`Entertainment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
