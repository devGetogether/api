const express = require('express');
const Venues = require('../models/Venue');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllVenues, getVenue, createNewVenue, updateVenue, deleteVenue } = require('../controllers/venue');

const router = express.Router({ mergeParams: true });

// Get all venues
router.route('/').get(protect,  advancedResults(Venues, '-password'), getAllVenues);

// Create new venue
router.route('/register').post(protect, createNewVenue);

router
	.route('/:id')
	// Get venue
	.get(getVenue)
	// Update venue
	.put(protect, updateVenue)
	// Delete venue
	.delete(protect, authorize('admin'), deleteVenue);

module.exports = router;
