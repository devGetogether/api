const express = require('express');
const Bars = require('../models/Bar');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllBars, getBar, createBar, updateBar, deleteBar } = require('../controllers/bar');

const router = express.Router({ mergeParams: true });

// Get all bars
router.route('/').get(protect,  advancedResults(Bars, '-password'), getAllBars);

// Create new bar
router.route('/register').post(protect, createBar);

router
	.route('/:id')
	// Get bar
	.get( getBar)
	// Update bar
	.put(protect, updateBar)
	// Delete bar
	.delete(protect, authorize('admin'), deleteBar);

module.exports = router;
