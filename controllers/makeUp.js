const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const MakeUpService = require('../models/MakeUp');
const User = require('../models/User');

// @desc    Get all make up services
// @route   GET /api/makeup
// @access  Public
exports.getAllMakeUpServices = asyncHandler(async (req, res, next) => {
	try {
		const makeUpServices = await MakeUpService.find();
		res.status(200).json({ success: true, data: makeUpServices });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single make up service
// @route   GET /api/makeup/:id
// @access  Public
exports.getMakeUpService = asyncHandler(async (req, res, next) => {
	try {
		const makeUpService = await MakeUpService.findById(req.params.id);
		if (!makeUpService) {
			return next(new errorResponse(`Make up service provider not found`, 404));
		}
		res
			.status(200)
			.json({ success: true, data: makeUpService, message: 'Make up service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create make up service
// @route   POST /api/makeup
// @access  Private
exports.createNewMakeUpService = asyncHandler(async (req, res, next) => {
	// check for published event planner
	const publishedMakeUpService = await MakeUpService.findOne({ user: req.user.id });

	// if there is a published event planner and the user is not an admin
	if (publishedMakeUpService) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Make Up Service registered.' });
	}
	try {
		const makeUpService = await MakeUpService.create(req.body);

		// add the makeUp role to the user roles array
		const userRoles = [...req.user.role, 'makeUp'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res.status(201).json({
			success: true,
			data: makeUpService,
			message: 'Make Up Service created successfully',
		});
	} catch (err) {
		next(err);
	}
});

// @desc    Update make up service
// @route   PUT /api/makeup/:id
// @access  Private
exports.updateMakeUpService = asyncHandler(async (req, res, next) => {
	try {
		const makeUpService = await MakeUpService.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!makeUpService) {
			return next(new errorResponse(`Make up service not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: makeUpService });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete make up service
// @route   DELETE /api/makeup/:id
// @access  Private
exports.deleteMakeUpService = asyncHandler(async (req, res, next) => {
	try {
		const makeUpService = await MakeUpService.findByIdAndDelete(req.params.id);
		if (!makeUpService) {
			return next(new errorResponse(`Make up service not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
