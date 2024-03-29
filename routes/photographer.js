const express = require('express');
const Photographers = require('../models/Photographer');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllPhotographers,
	getPhotographer,
	createNewPhotographer,
	updatePhotographer,
	deletePhotographer,
} = require('../controllers/photographers');

const router = express.Router({ mergeParams: true });

// Get all photographers
router.route('/').get(protect, authorize('admin'), advancedResults(Photographers, '-password'), getAllPhotographers);

// Create new photographer
router.route('/register').post(createNewPhotographer);

router
	.route('/:phoneNumber')
	// Get photographer
	.get(protect, getPhotographer)
	// Update photographer
	.put(protect, updatePhotographer)
	// Delete photographer
	.delete(protect, authorize('admin'), deletePhotographer);

module.exports = router;
