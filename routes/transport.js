const express = require('express');
const TransportProviders = require('../models/TransportProvider');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllTransportProviders,
	getTransportProvider,
	createNewTransportProvider,
	updateTransportProvider,
	deleteTransportProvider,
} = require('../controllers/transportProviders');

const router = express.Router({ mergeParams: true });

// Get all transport providers
router
	.route('/')
	.get(protect, authorize('admin'), advancedResults(TransportProviders, '-password'), getAllTransportProviders);

// Create new transport provider
router.route('/register').post(createNewTransportProvider);

router
	.route('/:phoneNumber')
	// Get transport provider
	.get(protect, getTransportProvider)
	// Update transport provider
	.put(protect, updateTransportProvider)
	// Delete transport provider
	.delete(protect, authorize('admin'), deleteTransportProvider);

module.exports = router;
