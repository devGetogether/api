const express = require('express');
const Cakes = require('../models/Cake');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllCakes, getCake, createNewCake, updateCake, deleteCake } = require('../controllers/cake');

const router = express.Router({ mergeParams: true });

// Get all cakes
router.route('/').get(protect,  advancedResults(Cakes, '-password'), getAllCakes);

// Create new cake
router.route('/register').post(protect, createNewCake);

router
	.route('/:id')
	// Get cake
	.get(getCake)
	// Update cake
	.put(protect, updateCake)
	// Delete cake
	.delete(protect, authorize('admin'), deleteCake);

module.exports = router;
