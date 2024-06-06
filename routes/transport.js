const express = require('express');
const Transports = require('../models/Transport');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllTransports,
	getTransport,
	createNewTransport,
	updateTransport,
	deleteTransport,
} = require('../controllers/transport');

const router = express.Router({ mergeParams: true });

// Get all transport s
router
	.route('/')
	.get(protect,  advancedResults(Transports, '-password'), getAllTransports);

// Create new transport
router.route('/register').post(protect, createNewTransport);

router
	.route('/:id')
	// Get transport
	.get(getTransport)
	// Update transport
	.put(protect, updateTransport)
	// Delete transport
	.delete(protect, authorize('admin'), deleteTransport);

module.exports = router;
