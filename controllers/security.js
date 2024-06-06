const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Security = require('../models/Security');
const User = require('../models/User');

// @desc    Get all security service providers
// @route   GET /api/security-service-providers
// @access  Public
exports.getAllSecurity = asyncHandler(async (req, res, next) => {
	try {
		const security = await Security.find();
		res.status(200).json({ success: true, data: security });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single security service provider
// @route   GET /api/security-service-providers/:id
// @access  Public
exports.getSecurity = asyncHandler(async (req, res, next) => {
	try {
		const security = await Security.findById(req.params.id);
		if (!security) {
			return next(
				new errorResponse(`Security service provider not found`, 404)
			);
		}
		res.status(200).json({ success: true, data: security, message: 'Security service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create security service provider
// @route   POST /api/security-service-providers
// @access  Private
exports.createNewSecurity = asyncHandler(async (req, res, next) => {
	req.body.userID = req.user.id;

	// check for published event planner
	const publishedSecurity = await Security.findOne({ user: req.user.id });

	// if there is a published event planner and the user is not an admin
	if (publishedSecurity) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Security Service registered.' });
	}
	try {
		const security = await Security.create(req.body);

		// add the security role to the user roles array
		const userRoles = [...req.user.role, 'security'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res
			.status(201)
			.json({ success: true, data: security, message: 'Security Service created successfully' });
	} catch (err) {
		next(err);
	}
});

// @desc    Update security service provider
// @route   PUT /api/security-service-providers/:id
// @access  Private
exports.updateSecurity = asyncHandler(async (req, res, next) => {
	try {
		const security = await Security.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!security) {
			return next(
				new errorResponse(`Security service provider not found with id ${req.params.id}`, 404)
			);
		}
		res.status(200).json({ success: true, data: security });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete security service provider
// @route   DELETE /api/security-service-providers/:id
// @access  Private
exports.deleteSecurity = asyncHandler(async (req, res, next) => {
	try {
		const security = await Security.findByIdAndDelete(req.params.id);
		if (!security) {
			return next(
				new errorResponse(`Security service provider not found with id ${req.params.id}`, 404)
			);
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
