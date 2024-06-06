const express = require('express');
const Decor = require('../models/Decor');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllDecor,
	getDecor,
	createNewDecor,
	updateDecor,
	deleteDecor,
} = require('../controllers/decor');

const router = express.Router({ mergeParams: true });

// Get all decor providers
router
	.route('/')
	.get(protect,  advancedResults(Decor, '-password'), getAllDecor);

// Create new decor provider
router.route('/register').post(protect, createNewDecor);

router
	.route('/:id')
	// Get decor provider
	.get(getDecor)
	// Update decor provider
	.put(protect, updateDecor)
	// Delete decor provider
	.delete(protect, authorize('admin'), deleteDecor);

module.exports = router;
