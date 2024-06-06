const express = require('express');
const MakeUpService = require('../models/MakeUp');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllMakeUpServices,
	getMakeUpService,
	createNewMakeUpService,
	updateMakeUpService,
	deleteMakeUpService,
} = require('../controllers/makeUp');

const router = express.Router({ mergeParams: true });

// Get all make-up providers
router
	.route('/')
	.get(
		protect,
	
		advancedResults(MakeUpService, '-password'),
		getAllMakeUpServices
	);

// Create new make-up provider
router.route('/register').post(protect, createNewMakeUpService);

router
	.route('/:id')
	// Get make-up provider
	.get(getMakeUpService)
	// Update make-up provider
	.put(protect, updateMakeUpService)
	// Delete make-up provider
	.delete(protect, authorize('admin'), deleteMakeUpService);

module.exports = router;
