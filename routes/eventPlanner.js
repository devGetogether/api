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
} = require('../controllers/eventplanners');

const router = express.Router({ mergeParams: true });

// Get all event planners
router.route('/').get(protect, authorize('admin'), advancedResults(EventPlanners, '-password'), getAllEventPlanners);

// Create new event planner
router.route('/register').post(createNewEventPlanner);

router
	.route('/:phoneNumber')
	// Get event planner
	.get(protect, getEventPlanner)
	// Update event planner
	.put(protect, updateEventPlanner)
	// Delete event planner
	.delete(protect, authorize('admin'), deleteEventPlanner);

module.exports = router;
