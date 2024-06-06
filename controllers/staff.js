const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Staff = require('../models/Staff');
const User = require('../models/User');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Public
exports.getAllStaff = asyncHandler(async (req, res, next) => {
	try {
		const staff = await Staff.find();
		res.status(200).json({ success: true, data: staff });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single staff
// @route   GET /api/staff/:id
// @access  Public
exports.getStaff = asyncHandler(async (req, res, next) => {
	try {
		const staff = await Staff.findById(req.params.id);
		if (!staff) {
			return next(new errorResponse(`Staff service provider not found`, 404));
		}
		res.status(200).json({ success: true, data: staff, message: 'Staff service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create staff member
// @route   POST /api/staff
// @access  Private
exports.createNewStaff = asyncHandler(async (req, res, next) => {
	req.body.userID = req.user.id;

	// check for published event planner
	const publishedStaff = await Staff.findOne({ user: req.user.id });

	// if there is a published event planner and the user is not an admin
	if (publishedStaff) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Staff Service registered.' });
	}
	try {
		const staff = await Staff.create(req.body);

		// add the staff role to the user roles array
		const userRoles = [...req.user.role, 'staff'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res
			.status(201)
			.json({ success: true, data: staff, message: 'Staff service created successfully' });
	} catch (err) {
		next(err);
	}
});

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private
exports.updateStaff = asyncHandler(async (req, res, next) => {
	try {
		const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!staff) {
			return next(new errorResponse(`Staff member not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: staff });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private
exports.deleteStaff = asyncHandler(async (req, res, next) => {
	try {
		const staff = await Staff.findByIdAndDelete(req.params.id);
		if (!staff) {
			return next(new errorResponse(`Staff member not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
