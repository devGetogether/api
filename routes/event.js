const express = require('express');
const {
	getAllEvents,
	getEvent,
	createNewEvent,
	updateEvent,
	addVendor,
    deleteEvent,
    getUserEvents
} = require('../controllers/event');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all Events
router.get('/', protect, authorize('admin'), getAllEvents);

// @desc    Get single Event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', getEvent);

router.get('/getEventsByUser/:userId', protect, getUserEvents);

// @desc    Create Event
router.post('/', protect, createNewEvent);

// @desc    Update Event
router.put('/:id', protect, updateEvent);

// @desc    Add Vendor
router.put('/addVendor/:id', protect, addVendor);

// @desc    Delete Event
router.delete('/:id', protect, deleteEvent);

module.exports = router;
