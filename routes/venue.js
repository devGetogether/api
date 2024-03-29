const express = require('express');
const Venues = require('../models/Venue');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllVenues, getVenue, createNewVenue, updateVenue, deleteVenue } = require('../controllers/venues');

const router = express.Router({ mergeParams: true });

// Get all venues
router.route('/').get(protect, authorize('admin'), advancedResults(Venues, '-password'), getAllVenues);

// Create new venue
router.route('/register').post(createNewVenue);

router
	.route('/:id')
	// Get venue
	.get(protect, getVenue)
	// Update venue
	.put(protect, updateVenue)
	// Delete venue
	.delete(protect, authorize('admin'), deleteVenue);

module.exports = router;
