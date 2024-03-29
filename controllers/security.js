const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const SecurityServiceProvider = require('../models/SecurityServiceProvider');

// @desc    Get all security service providers
// @route   GET /api/security-service-providers
// @access  Public
exports.getSecurityServiceProviders = asyncHandler(async (req, res, next) => {
	try {
		const securityServiceProviders = await SecurityServiceProvider.find();
		res.status(200).json({ success: true, data: securityServiceProviders });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single security service provider
// @route   GET /api/security-service-providers/:id
// @access  Public
exports.getSecurityServiceProvider = asyncHandler(async (req, res, next) => {
	try {
		const securityServiceProvider = await SecurityServiceProvider.findById(req.params.id);
		if (!securityServiceProvider) {
			return next(new errorResponse(`Security service provider not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: securityServiceProvider });
	} catch (err) {
		next(err);
	}
});

// @desc    Create security service provider
// @route   POST /api/security-service-providers
// @access  Private
exports.createSecurityServiceProvider = asyncHandler(async (req, res, next) => {
	try {
		const securityServiceProvider = await SecurityServiceProvider.create(req.body);
		res.status(201).json({ success: true, data: securityServiceProvider });
	} catch (err) {
		next(err);
	}
});

// @desc    Update security service provider
// @route   PUT /api/security-service-providers/:id
// @access  Private
exports.updateSecurityServiceProvider = asyncHandler(async (req, res, next) => {
	try {
		const securityServiceProvider = await SecurityServiceProvider.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!securityServiceProvider) {
			return next(new errorResponse(`Security service provider not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: securityServiceProvider });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete security service provider
// @route   DELETE /api/security-service-providers/:id
// @access  Private
exports.deleteSecurityServiceProvider = asyncHandler(async (req, res, next) => {
	try {
		const securityServiceProvider = await SecurityServiceProvider.findByIdAndDelete(req.params.id);
		if (!securityServiceProvider) {
			return next(new errorResponse(`Security service provider not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
