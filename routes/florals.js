const express = require('express');
const Florals = require('../models/Florals');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllFlorals, getFloral, createNewFloral, updateFloral, deleteFloral } = require('../controllers/florals');

const router = express.Router({ mergeParams: true });

// Get all florals
router.route('/').get(protect,  advancedResults(Florals, '-password'), getAllFlorals);

// Create new floral
router.route('/register').post(protect, createNewFloral);

router
	.route('/:phoneNumber')
	// Get floral
	.get(getFloral)
	// Update floral
	.put(protect, updateFloral)
	// Delete floral
	.delete(protect, authorize('admin'), deleteFloral);

module.exports = router;
