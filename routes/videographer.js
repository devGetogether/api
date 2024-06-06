const express = require('express');
const Videographers = require('../models/Videographer');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllVideographers,
	getVideographer,
	createNewVideographer,
	updateVideographer,
	deleteVideographer,
} = require('../controllers/Videographer');

const router = express.Router({ mergeParams: true });

// Get all videographers
router.route('/').get(
	protect,

	advancedResults(Videographers, '-password'),
	getAllVideographers
);

// Create new videographer
router.route('/register').post(protect, createNewVideographer);

router
	.route('/:id')
	// Get videographer
	.get( getVideographer)
	// Update videographer
	.put(protect, updateVideographer)
	// Delete videographer
	.delete(protect, authorize('admin'), deleteVideographer);

module.exports = router;
