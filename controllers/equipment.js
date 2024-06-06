const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
exports.getAllEquipment = asyncHandler(async (req, res, next) => {
	try {
		const equipment = await Equipment.find();
		res.status(200).json({ success: true, data: equipment });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Public
exports.getSingleEquipment = asyncHandler(async (req, res, next) => {
	try {
		const equipment = await Equipment.findById(req.params.id);
		if (!equipment) {
			return next(new errorResponse(`Equipment service provider not found `, 404));
		}
		res
			.status(200)
			.json({ success: true, data: equipment, message: 'Equipment service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private
exports.createNewEquipment = asyncHandler(async (req, res, next) => {
	// check User
	req.body.userID = req.user.id;

	// check if there is alread a entertainment service for the user
	const existingEquipment = await Equipment.findOne({ userID: req.user.id });

	if (existingEquipment) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Entertainment Service registered.' });
	}
	try {
		const equipment = await Equipment.create(req.body);

		// add the equipment role to the user roles array
		const userRoles = [...req.user.role, 'equipment'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });
		res
			.status(201)
			.json({ success: true, data: equipment, message: 'Equipment Service created successfully' });
	} catch (err) {
		next(err);
	}
});

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private
exports.updateEquipment = asyncHandler(async (req, res, next) => {
	try {
		const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!equipment) {
			return next(new errorResponse(`Equipment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: equipment });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private
exports.deleteEquipment = asyncHandler(async (req, res, next) => {
	try {
		const equipment = await Equipment.findByIdAndDelete(req.params.id);
		if (!equipment) {
			return next(new errorResponse(`Equipment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
