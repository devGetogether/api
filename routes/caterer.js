const express = require('express');
const Caterers = require('../models/Caterer');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllCaterers,
	getCaterer,
	createNewCaterer,
	updateCaterer,
	deleteCaterer,
} = require('../controllers/caterer');

const router = express.Router({ mergeParams: true });

// Get all caterers
router
	.route('/')
	.get(protect,  advancedResults(Caterers, '-password'), getAllCaterers);

// Create new caterer
router.route('/register').post(protect, createNewCaterer);

router
	.route('/:id')
	// Get caterer
	.get(getCaterer)
	// Update caterer
	.put(protect, updateCaterer)
	// Delete caterer
	.delete(protect, authorize('admin'), deleteCaterer);

module.exports = router;
