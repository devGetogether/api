const express = require('express');
const Entertainment = require('../models/Entertainment');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllEntertainment,
	getEntertainment,
	createNewEntertainment,
	updateEntertainment,
	deleteEntertainment,
} = require('../controllers/entertainment');

const router = express.Router({ mergeParams: true });

// Get all entertainment providers
router
	.route('/')
	.get(
		protect,

		advancedResults(Entertainment, '-password'),
		getAllEntertainment
	);

// Create new entertainment provider
router.route('/register').post(protect, createNewEntertainment);

router
	.route('/:id')
	// Get entertainment provider
	.get(getEntertainment)
	// Update entertainment provider
	.put(protect, updateEntertainment)
	// Delete entertainment provider
	.delete(protect, authorize('admin'), deleteEntertainment);

module.exports = router;
