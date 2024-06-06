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
} = require('../controllers/photographer');

const router = express.Router({ mergeParams: true });

// Get all photographers
router
	.route('/')
	.get(
		protect,
		
		advancedResults(Photographers, '-password'),
		getAllPhotographers
	);

// Create new photographer
router.route('/register').post(protect, createNewPhotographer);

router
	.route('/:id')
	// Get photographer
	.get(getPhotographer)
	// Update photographer
	.put(protect, updatePhotographer)
	// Delete photographer
	.delete(protect, authorize('admin'), deletePhotographer);

module.exports = router;
