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
} = require('../controllers/caterers');

const router = express.Router({ mergeParams: true });

// Get all caterers
router.route('/').get(protect, authorize('admin'), advancedResults(Caterers, '-password'), getAllCaterers);

// Create new caterer
router.route('/register').post(createNewCaterer);

router
	.route('/:phoneNumber')
	// Get caterer
	.get(protect, getCaterer)
	// Update caterer
	.put(protect, updateCaterer)
	// Delete caterer
	.delete(protect, authorize('admin'), deleteCaterer);

module.exports = router;
