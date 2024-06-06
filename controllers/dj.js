const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const DJ = require('../models/DJ');
const User = require('../models/User');

// @desc    Get all DJs
// @route   GET /api/DJs
// @access  Public
exports.getAllDJ = asyncHandler(async (req, res, next) => {
	try {
		const DJs = await DJ.find();
		res.status(200).json({ success: true, data: DJs });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single DJ
// @route   GET /api/DJs/:id
// @access  Public
exports.getDJ = asyncHandler(async (req, res, next) => {
	try {
		const dj = await DJ.findById(req.params.id);
		if (dj) {
			return next(new errorResponse(`DJ not found`, 404));
		}
		res.status(200).json({ success: true, data: dj, message: 'DJ found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create DJ
// @route   POST /api/DJs
// @access  Private
exports.createNewDJ = asyncHandler(async (req, res, next) => {
	// check User
	req.body.userID = req.user.id;

	// check if there is alread a DJ service for the user
	const existingDJ = await DJ.findOne({ userID: req.user.id });

	if (existingDJ) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a DJ Service registered.' });
	}

	try {
		const newDJ = await DJ.create(req.body);

		// add the `dj` role to the user roles array
		const userRoles = [...req.user.role, 'dj'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });
		res.status(201).json({
			success: true,
			data: newDJ,
			message: 'DJ service created successfully',
		});
	} catch (err) {
		next(err);
	}
});

// @desc    Update DJ
// @route   PUT /api/DJs/:id
// @access  Private
exports.updateDJ = asyncHandler(async (req, res, next) => {
	try {
		const DJ = await DJ.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!DJ) {
			return next(new errorResponse(`DJ not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: DJ });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete DJ
// @route   DELETE /api/DJs/:id
// @access  Private
exports.deleteDJ = asyncHandler(async (req, res, next) => {
	try {
		const DJ = await DJ.findByIdAndDelete(req.params.id);
		if (!DJ) {
			return next(new errorResponse(`DJ not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
