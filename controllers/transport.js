const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Transport = require('../models/Transport');
const User = require('../models/User');

// @desc    Get all transports
// @route   GET /api/transports
// @access  Public
exports.getAllTransports = asyncHandler(async (req, res, next) => {
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
			return next(new errorResponse(`Transport service provider not found`, 404));
		}
		res.status(200).json({ success: true, data: transport, message: 'Transport service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create transport
// @route   POST /api/transports
// @access  Private
exports.createNewTransport = asyncHandler(async (req, res, next) => {
	req.body.userID = req.user.id;

	// check for published event planner
	const publishedTransport = await Transport.findOne({ user: req.user.id });

	// if there is a published event planner and the user is not an admin
	if (publishedTransport) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Transport Service registered.' });
	}
	try {
		const transport = await Transport.create(req.body);

		// add the transport role to the user roles array
		const userRoles = [...req.user.role, 'transport'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res
			.status(201)
			.json({ success: true, data: transport, message: 'Transport service created successfully' });
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
