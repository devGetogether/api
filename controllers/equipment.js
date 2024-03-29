const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Equipment = require('../models/Equipment');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
exports.getEquipment = asyncHandler(async (req, res, next) => {
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
			return next(new errorResponse(`Equipment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: equipment });
	} catch (err) {
		next(err);
	}
});

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private
exports.createEquipment = asyncHandler(async (req, res, next) => {
	try {
		const equipment = await Equipment.create(req.body);
		res.status(201).json({ success: true, data: equipment });
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
