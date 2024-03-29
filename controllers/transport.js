const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Transport = require('../models/Transport');

// @desc    Get all transports
// @route   GET /api/transports
// @access  Public
exports.getTransports = asyncHandler(async (req, res, next) => {
	try {
		const transports = await Transport.find();
		res.status(200).json({ success: true, data: transports });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single transport
// @route   GET /api/transports/:id
// @access  Public
exports.getTransport = asyncHandler(async (req, res, next) => {
	try {
		const transport = await Transport.findById(req.params.id);
		if (!transport) {
			return next(new errorResponse(`Transport not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: transport });
	} catch (err) {
		next(err);
	}
});

// @desc    Create transport
// @route   POST /api/transports
// @access  Private
exports.createTransport = asyncHandler(async (req, res, next) => {
	try {
		const transport = await Transport.create(req.body);
		res.status(201).json({ success: true, data: transport });
	} catch (err) {
		next(err);
	}
});

// @desc    Update transport
// @route   PUT /api/transports/:id
// @access  Private
exports.updateTransport = asyncHandler(async (req, res, next) => {
	try {
		const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!transport) {
			return next(new errorResponse(`Transport not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: transport });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete transport
// @route   DELETE /api/transports/:id
// @access  Private
exports.deleteTransport = asyncHandler(async (req, res, next) => {
	try {
		const transport = await Transport.findByIdAndDelete(req.params.id);
		if (!transport) {
			return next(new errorResponse(`Transport not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
