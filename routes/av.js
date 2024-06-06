const express = require('express');
const AV = require('../models/AV');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllAV, getAV, createNewAV, updateAV, deleteAV } = require('../controllers/av');

const router = express.Router({ mergeParams: true });

// Get all AV providers
router.route('/').get(advancedResults(AV, '-password'), getAllAV);

// Create new AV provider
router.route('/register').post(protect, createNewAV);

router
	.route('/:id')
	// Get AV provider
	.get(getAV)
	// Update AV provider
	.put(protect, updateAV)
	// Delete AV provider
	.delete(protect, authorize('admin'), deleteAV);

module.exports = router;
