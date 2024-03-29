const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Staff = require('../models/Staff');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Public
exports.getStaff = asyncHandler(async (req, res, next) => {
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
exports.getStaffMember = asyncHandler(async (req, res, next) => {
	try {
		const staffMember = await Staff.findById(req.params.id);
		if (!staffMember) {
			return next(new errorResponse(`Staff member not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: staffMember });
	} catch (err) {
		next(err);
	}
});

// @desc    Create staff member
// @route   POST /api/staff
// @access  Private
exports.createStaffMember = asyncHandler(async (req, res, next) => {
	try {
		const staffMember = await Staff.create(req.body);
		res.status(201).json({ success: true, data: staffMember });
	} catch (err) {
		next(err);
	}
});

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private
exports.updateStaffMember = asyncHandler(async (req, res, next) => {
	try {
		const staffMember = await Staff.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!staffMember) {
			return next(new errorResponse(`Staff member not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: staffMember });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private
exports.deleteStaffMember = asyncHandler(async (req, res, next) => {
	try {
		const staffMember = await Staff.findByIdAndDelete(req.params.id);
		if (!staffMember) {
			return next(new errorResponse(`Staff member not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
