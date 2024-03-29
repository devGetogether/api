const express = require('express');
const MakeUpProviders = require('../models/MakeUpProvider');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllMakeUpProviders,
	getMakeUpProvider,
	createNewMakeUpProvider,
	updateMakeUpProvider,
	deleteMakeUpProvider,
} = require('../controllers/makeUpProviders');

const router = express.Router({ mergeParams: true });

// Get all make-up providers
router
	.route('/')
	.get(protect, authorize('admin'), advancedResults(MakeUpProviders, '-password'), getAllMakeUpProviders);

// Create new make-up provider
router.route('/register').post(createNewMakeUpProvider);

router
	.route('/:phoneNumber')
	// Get make-up provider
	.get(protect, getMakeUpProvider)
	// Update make-up provider
	.put(protect, updateMakeUpProvider)
	// Delete make-up provider
	.delete(protect, authorize('admin'), deleteMakeUpProvider);

module.exports = router;
