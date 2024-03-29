const express = require('express');
const SecurityProviders = require('../models/SecurityProvider');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllSecurityProviders,
	getSecurityProvider,
	createNewSecurityProvider,
	updateSecurityProvider,
	deleteSecurityProvider,
} = require('../controllers/securityProviders');

const router = express.Router({ mergeParams: true });

// Get all security providers
router
	.route('/')
	.get(protect, authorize('admin'), advancedResults(SecurityProviders, '-password'), getAllSecurityProviders);

// Create new security provider
router.route('/register').post(createNewSecurityProvider);

router
	.route('/:phoneNumber')
	// Get security provider
	.get(protect, getSecurityProvider)
	// Update security provider
	.put(protect, updateSecurityProvider)
	// Delete security provider
	.delete(protect, authorize('admin'), deleteSecurityProvider);

module.exports = router;
