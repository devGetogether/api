const express = require('express');
const Bars = require('../models/Bar');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllBars, getBar, createNewBar, updateBar, deleteBar } = require('../controllers/bars');

const router = express.Router({ mergeParams: true });

// Get all bars
router.route('/').get(protect, authorize('admin'), advancedResults(Bars, '-password'), getAllBars);

// Create new bar
router.route('/register').post(createNewBar);

router
	.route('/:id')
	// Get bar
	.get(protect, getBar)
	// Update bar
	.put(protect, updateBar)
	// Delete bar
	.delete(protect, authorize('admin'), deleteBar);

module.exports = router;
