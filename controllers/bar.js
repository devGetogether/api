const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const Bar = require('../models/Bar');
const User = require('../models/User');

// @desc    Get all bars
// @route   GET /api/bars
// @access  Public
exports.getAllBars = asyncHandler(async (req, res, next) => {
	try {
		const bars = await Bar.find();
		res.status(200).json({ success: true, data: bars });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single bar
// @route   GET /api/bars/:id
// @access  Public
exports.getBar = asyncHandler(async (req, res, next) => {
	try {
		const bar = await Bar.findById(req.params.id);
		if (!bar) {
			return next(new errorResponse(`Bar service provider not found`, 404));
		}
		res.status(200).json({ success: true, data: bar, message: 'Bar service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create bar
// @route   POST /api/bars
// @access  Private
exports.createBar = asyncHandler(async (req, res, next) => {
	console.log;
	// check User
	req.body.userID = req.user.id;

	const existingBar = await Bar.findOne({ userID: req.user.id });
	if (existingBar) {
		return res.status(400).json({ success: false, message: 'User already has a Bar registered.' });
	}

	try {
		const bar = await Bar.create(req.body);
		res.status(201).json({ success: true, message: 'Bar service created successfully', data: bar });

		// add the bar role to the user roles array
		const userRoles = [...req.user.role, 'bar'];

		// update the user with the new role
		const user = await User.findByIdAndUpdate(req.user.id, { role: userRoles });
	} catch (err) {
		console.log(err);
		res.status(400).json({ success: false, message: `Failed to create service: ${err.message}` });
	}
});

// @desc    Update bar
// @route   PUT /api/bars/:id
// @access  Private
exports.updateBar = asyncHandler(async (req, res, next) => {
	try {
		const bar = await Bar.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!bar) {
			return next(new errorResponse(`Bar not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: bar });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete bar
// @route   DELETE /api/bars/:id
// @access  Private
exports.deleteBar = asyncHandler(async (req, res, next) => {
	try {
		const bar = await Bar.findByIdAndDelete(req.params.id);
		if (!bar) {
			return next(new errorResponse(`Bar not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
