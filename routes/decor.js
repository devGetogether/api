const express = require('express');
const DecorProviders = require('../models/DecorProvider');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllDecorProviders,
	getDecorProvider,
	createNewDecorProvider,
	updateDecorProvider,
	deleteDecorProvider,
} = require('../controllers/decorProviders');

const router = express.Router({ mergeParams: true });

// Get all decor providers
router.route('/').get(protect, authorize('admin'), advancedResults(DecorProviders, '-password'), getAllDecorProviders);

// Create new decor provider
router.route('/register').post(createNewDecorProvider);

router
	.route('/:phoneNumber')
	// Get decor provider
	.get(protect, getDecorProvider)
	// Update decor provider
	.put(protect, updateDecorProvider)
	// Delete decor provider
	.delete(protect, authorize('admin'), deleteDecorProvider);

module.exports = router;
