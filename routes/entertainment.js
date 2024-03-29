const express = require('express');
const EntertainmentProviders = require('../models/EntertainmentProvider');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllEntertainmentProviders,
	getEntertainmentProvider,
	createNewEntertainmentProvider,
	updateEntertainmentProvider,
	deleteEntertainmentProvider,
} = require('../controllers/entertainmentProviders');

const router = express.Router({ mergeParams: true });

// Get all entertainment providers
router
	.route('/')
	.get(protect, authorize('admin'), advancedResults(EntertainmentProviders, '-password'), getAllEntertainmentProviders);

// Create new entertainment provider
router.route('/register').post(createNewEntertainmentProvider);

router
	.route('/:phoneNumber')
	// Get entertainment provider
	.get(protect, getEntertainmentProvider)
	// Update entertainment provider
	.put(protect, updateEntertainmentProvider)
	// Delete entertainment provider
	.delete(protect, authorize('admin'), deleteEntertainmentProvider);

module.exports = router;
