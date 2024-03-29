const express = require('express');
const Cakes = require('../models/cake');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllCakes, getCake, createNewCake, updateCake, deleteCake } = require('../controllers/cakes');

const router = express.Router({ mergeParams: true });

// Get all cakes
router.route('/').get(protect, authorize('admin'), advancedResults(Cakes, '-password'), getAllCakes);

// Create new cake
router.route('/register').post(createNewCake);

router
	.route('/:cakeId')
	// Get cake
	.get(protect, getCake)
	// Update cake
	.put(protect, updateCake)
	// Delete cake
	.delete(protect, authorize('admin'), deleteCake);

module.exports = router;
