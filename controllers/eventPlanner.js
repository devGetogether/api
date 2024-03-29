const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const EventPlanner = require('../models/EventPlanner');

// @desc    Get all event planners
// @route   GET /api/eventplanners
// @access  Public
exports.getEventPlanners = asyncHandler(async (req, res, next) => {
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
			return next(new errorResponse(`Event planner not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: eventPlanner });
	} catch (err) {
		next(err);
	}
});

// @desc    Create event planner
// @route   POST /api/eventplanners
// @access  Private
exports.createEventPlanner = asyncHandler(async (req, res, next) => {
	try {
		const eventPlanner = await EventPlanner.create(req.body);
		res.status(201).json({ success: true, data: eventPlanner });
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
