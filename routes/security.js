const express = require('express');
const Security = require('../models/Security');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllSecurity,
	getSecurity,
	createNewSecurity,
	updateSecurity,
	deleteSecurity,
} = require('../controllers/security');

const router = express.Router({ mergeParams: true });

// Get all security providers
router
	.route('/')
	.get(protect, advancedResults(Security, '-password'), getAllSecurity);

// Create new security provider
router.route('/register').post(protect, createNewSecurity);

router
	.route('/:id')
	// Get security provider
	.get(getSecurity)
	// Update security provider
	.put(protect, updateSecurity)
	// Delete security provider
	.delete(protect, authorize('admin'), deleteSecurity);

module.exports = router;
