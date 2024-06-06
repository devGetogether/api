const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Floral = require('../models/Florals');
const User = require('../models/User');

// @desc    Get all florals
// @route   GET /api/florals
// @access  Public
exports.getAllFlorals = asyncHandler(async (req, res, next) => {
	try {
		const florals = await Floral.find();
		res.status(200).json({ success: true, data: florals });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single floral
// @route   GET /api/florals/:id
// @access  Public
exports.getFloral = asyncHandler(async (req, res, next) => {
	try {
		const floral = await Floral.findById(req.params.id);
		if (!floral) {
			return next(new errorResponse(`Florals service provider not found`, 404));
		}
		res
			.status(200)
			.json({ success: true, data: floral, message: 'Florals service provider found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create floral
// @route   POST /api/florals
// @access  Private
exports.createNewFloral = asyncHandler(async (req, res, next) => {
	// check for published event planner
	const publishedFloral = await Floral.findOne({ user: req.user.id });

	// if there is a published event planner and the user is not an admin
	if (publishedFloral) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Florals Service registered.' });
	}
	try {
		const floral = await Floral.create(req.body);

		// add the floral role to the user roles array
		const userRoles = [...req.user.role, 'floral'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res
			.status(201)
			.json({ success: true, data: floral, message: 'Florals Service created successfully' });
	} catch (err) {
		next(err);
	}
});

// @desc    Update floral
// @route   PUT /api/florals/:id
// @access  Private
exports.updateFloral = asyncHandler(async (req, res, next) => {
	try {
		const floral = await Floral.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!floral) {
			return next(new errorResponse(`Floral not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: floral });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete floral
// @route   DELETE /api/florals/:id
// @access  Private
exports.deleteFloral = asyncHandler(async (req, res, next) => {
	try {
		const floral = await Floral.findByIdAndDelete(req.params.id);
		if (!floral) {
			return next(new errorResponse(`Floral not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
