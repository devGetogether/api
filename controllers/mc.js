const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const MC = require('../models/MC');
const User = require('../models/User');

// @desc    Get all MCs
// @route   GET /api/mcs
// @access  Public
exports.getAllMCs = asyncHandler(async (req, res, next) => {
	try {
		const mcs = await MC.find();
		res.status(200).json({ success: true, data: mcs });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single MC
// @route   GET /api/mcs/:id
// @access  Public
exports.getMC = asyncHandler(async (req, res, next) => {
	try {
		const mc = await MC.findById(req.params.id);
		if (!mc) {
			return next(new errorResponse(`MC not found`, 404));
		}
		res.status(200).json({ success: true, data: mc, message: 'MC found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create MC
// @route   POST /api/mcs
// @access  Private
exports.createNewMC = asyncHandler(async (req, res, next) => {
	req.body.userID = req.user.id;

	// check for published event planner
	const publishedMC = await MC.findOne({ user: req.user.id });

	// if there is a published event planner and the user is not an admin
	if (publishedMC) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a MC Service registered.' });
	}
	try {
		const mc = await MC.create(req.body);

		// add the mc role to the user roles array
		const userRoles = [...req.user.role, 'mc'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res.status(201).json({ success: true, data: mc, message: 'MC created successfully' });
	} catch (err) {
		next(err);
	}
});

// @desc    Update MC
// @route   PUT /api/mcs/:id
// @access  Private
exports.updateMC = asyncHandler(async (req, res, next) => {
	console.log('Id: ', req.params.id);
	console.log('Body: ', req.body);
	try {
		const mc = await MC.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!mc) {
			return next(new errorResponse(`MC not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: mc });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete MC
// @route   DELETE /api/mcs/:id
// @access  Private
exports.deleteMC = asyncHandler(async (req, res, next) => {
	try {
		const mc = await MC.findByIdAndDelete(req.params.id);
		if (!mc) {
			return next(new errorResponse(`MC not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
