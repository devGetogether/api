const express = require('express');
const MCs = require('../models/MC');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllMCs, getMC, createNewMC, updateMC, deleteMC } = require('../controllers/mc');

const router = express.Router({ mergeParams: true });

// Get all merchants
router.route('/').get(protect,  advancedResults(MCs, '-password'), getAllMCs);

// Create new merchant
router.route('/register').post(protect, createNewMC);

router
	.route('/:id')
	// Get merchant
	.get(getMC)
	// Update merchant
	.put(protect, updateMC)
	// Delete merchant
	.delete(protect, authorize('admin'), deleteMC);

module.exports = router;
