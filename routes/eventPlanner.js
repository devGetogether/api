const express = require('express');
const EventPlanners = require('../models/EventPlanner');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllEventPlanners,
	getEventPlanner,
	createNewEventPlanner,
	updateEventPlanner,
	deleteEventPlanner,
} = require('../controllers/eventplanner');

const router = express.Router({ mergeParams: true });

// Get all event planners
router
	.route('/')
	.get(
		protect,

		advancedResults(EventPlanners, '-password'),
		getAllEventPlanners
	);

// Create new event planner
router.route('/register').post(protect, createNewEventPlanner);

router
	.route('/:id')
	// Get event planner
	.get(getEventPlanner)
	// Update event planner
	.put(protect, updateEventPlanner)
	// Delete event planner
	.delete(protect, authorize('admin'), deleteEventPlanner);

module.exports = router;
