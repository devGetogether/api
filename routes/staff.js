const express = require('express');
const Staff = require('../models/Staff');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const { getAllStaff, getStaff, createNewStaff, updateStaff, deleteStaff } = require('../controllers/staff');

const router = express.Router({ mergeParams: true });

// Get all staff
router.route('/').get(protect,  advancedResults(Staff), getAllStaff);

// Create new staff
router.route('/register').post(protect, createNewStaff);

router
	.route('/:id')
	// Get staff
	.get(getStaff)
	// Update staff
	.put(protect, updateStaff)
	// Delete staff
	.delete(protect, authorize('admin'), deleteStaff);

module.exports = router;
