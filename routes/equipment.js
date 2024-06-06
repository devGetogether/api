const express = require('express');
const Equipment = require('../models/Equipment');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllEquipment,
	getSingleEquipment,
	createNewEquipment,
	updateEquipment,
	deleteEquipment,
} = require('../controllers/Equipment');

const router = express.Router({ mergeParams: true });

// Get all Equipment providers
router
	.route('/')
	.get(protect,  advancedResults(Equipment, '-password'), getAllEquipment);

// Create new Equipment provider
router.route('/register').post(protect, createNewEquipment);

router
	.route('/:id')
	// Get Equipment provider
	.get(getSingleEquipment)
	// Update Equipment provider
	.put(protect, updateEquipment)
	// Delete Equipment provider
	.delete(protect, authorize('admin'), deleteEquipment);

module.exports = router;
