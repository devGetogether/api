const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const AV = require('../models/AV');
const User = require('../models/User');

// @desc    Get all AVs
// @route   GET /api/AVs
// @access  Public
exports.getAllAV = asyncHandler(async (req, res, next) => {
	try {
		const AVs = await AV.find();
		res.status(200).json({ success: true, data: AVs });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single AV
// @route   GET /api/AVs/:id
// @access  Public
exports.getAV = asyncHandler(async (req, res, next) => {
	console.log(req.params.id);
	try {
		const av = await AV.findById(req.params.id);
		if (!av) {
			return next(new errorResponse(`AV service provider not found `, 404));
		}
		res.status(200).json({ success: true, data: av, message: 'AV service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create AV
// @route   POST /api/AVs
// @access  Private
exports.createNewAV = asyncHandler(async (req, res, next) => {
	// check User
	req.body.userID = req.user.id;

	// check if there is alread a AV service for the user
	const existingAV = await AV.findOne({ userID: req.user.id });

	if (existingAV) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a AV Service registered.' });
	}

	try {
		const newAV = await AV.create(req.body);

		// add the av role to the user roles array
		const userRoles = [...req.user.role, 'av'];

		// update the user with the new role
		const user = await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res.status(201).json({
			success: true,
			data: newAV,
			message: 'AV service created successfully',
		});
	} catch (err) {
		next(err);
	}
});

// @desc    Update AV
// @route   PUT /api/AVs/:id
// @access  Private
exports.updateAV = asyncHandler(async (req, res, next) => {
	try {
		const AV = await AV.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!AV) {
			return next(new errorResponse(`AV not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: AV });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete AV
// @route   DELETE /api/AVs/:id
// @access  Private
exports.deleteAV = asyncHandler(async (req, res, next) => {
	try {
		const AV = await AV.findByIdAndDelete(req.params.id);
		if (!AV) {
			return next(new errorResponse(`AV not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
