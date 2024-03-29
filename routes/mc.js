const express = require('express');
const Merchants = require('../models/Merchant');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllMerchants,
	getMerchant,
	createNewMerchant,
	updateMerchant,
	deleteMerchant,
} = require('../controllers/mc');

const router = express.Router({ mergeParams: true });

// Get all merchants
router.route('/').get(protect, authorize('admin'), advancedResults(Merchants, '-password'), getAllMerchants);

// Create new merchant
router.route('/register').post(createNewMerchant);

router
	.route('/:phoneNumber')
	// Get merchant
	.get(protect, getMerchant)
	// Update merchant
	.put(protect, updateMerchant)
	// Delete merchant
	.delete(protect, authorize('admin'), deleteMerchant);

module.exports = router;
