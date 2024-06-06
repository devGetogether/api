const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const EventPlanner = require('../models/EventPlanner');
const User = require('../models/User');

// @desc    Get all event planners
// @route   GET /api/eventplanners
// @access  Public
exports.getAllEventPlanners = asyncHandler(async (req, res, next) => {
	try {
		const eventPlanners = await EventPlanner.find();
		res.status(200).json({ success: true, data: eventPlanners });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single event planner
// @route   GET /api/eventplanners/:id
// @access  Public
exports.getEventPlanner = asyncHandler(async (req, res, next) => {
	try {
		const eventPlanner = await EventPlanner.findById(req.params.id);
		if (!eventPlanner) {
			return next(new errorResponse(`Event planner not found`, 404));
		}
		res.status(200).json({ success: true, data: eventPlanner, message: 'Event planner found' });
	} catch (err) {
		next(err);
	}
});

// @desc    Create event planner
// @route   POST /api/eventplanners
// @access  Private
exports.createNewEventPlanner = asyncHandler(async (req, res, next) => {
	// check user
	req.body.user = req.user.id;

	// check for published event planner
	const publishedEventPlanner = await EventPlanner.findOne({ user: req.user.id });

	// if there is a published event planner and the user is not an admin
	if (publishedEventPlanner) {
		return res
			.status(400)
			.json({ success: false, message: 'User already has a Event Planner Service registered.' });
	}

	try {
		const eventPlanner = await EventPlanner.create(req.body);

		// add the eventPlanner role to the user roles array
		const userRoles = [...req.user.role, 'eventPlanner'];

		// update the user with the new role
		await User.findByIdAndUpdate(req.user.id, { role: userRoles });

		res.status(201).json({
			success: true,
			data: eventPlanner,
			message: 'Event Planner Service created successfully',
		});
	} catch (err) {
		next(err);
	}
});

// @desc    Update event planner
// @route   PUT /api/eventplanners/:id
// @access  Private
exports.updateEventPlanner = asyncHandler(async (req, res, next) => {
	try {
		const eventPlanner = await EventPlanner.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!eventPlanner) {
			return next(new errorResponse(`Event planner not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: eventPlanner });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete event planner
// @route   DELETE /api/eventplanners/:id
// @access  Private
exports.deleteEventPlanner = asyncHandler(async (req, res, next) => {
	try {
		const eventPlanner = await EventPlanner.findByIdAndDelete(req.params.id);
		if (!eventPlanner) {
			return next(new errorResponse(`Event planner not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
