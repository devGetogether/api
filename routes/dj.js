const express = require('express');
const DJ = require('../models/DJ');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllDJ, getDJ, createNewDJ, updateDJ, deleteDJ } = require('../controllers/dj');

const router = express.Router({ mergeParams: true });

// Get all DJ providers
router.route('/').get(protect, advancedResults(DJ, '-password'), getAllDJ);

// Create new DJ provider
router.route('/register').post(protect, createNewDJ);

router
	.route('/:id')
	// Get DJ provider
	.get( getDJ)
	// Update DJ provider
	.put(protect, updateDJ)
	// Delete DJ provider
	.delete(protect, authorize('admin'), deleteDJ);

module.exports = router;
