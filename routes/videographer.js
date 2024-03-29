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
} = require('../controllers/videographers');

const router = express.Router({ mergeParams: true });

// Get all videographers
router.route('/').get(protect, authorize('admin'), advancedResults(Videographers, '-password'), getAllVideographers);

// Create new videographer
router.route('/register').post(createNewVideographer);

router
	.route('/:phoneNumber')
	// Get videographer
	.get(protect, getVideographer)
	// Update videographer
	.put(protect, updateVideographer)
	// Delete videographer
	.delete(protect, authorize('admin'), deleteVideographer);

module.exports = router;
