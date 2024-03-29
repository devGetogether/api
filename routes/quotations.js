const express = require('express');

const {
	getAllQuotations,
	getQuotation,
	createNewQuotation,
	updateQuotation,
	deleteQuotation,
	acceptQuotation,
} = require('../controllers/quotations');

const Quotations = require('../models/Quotation');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({
	mergeParams: true,
});

const { protect, authorize } = require('../middleware/auth');

// Get all Quotations
router.route('/').get(
	protect,
	authorize('doctor', 'admin', 'pharmacist'),
	advancedResults(Quotations, [
		{
			path: 'pharmacy',
			select: 'name location contactInformation isVerified',
		},
		{
			path: 'prescription',
			select: 'medication',
		},
	]),
	getAllQuotations
);

// Create new Quotation
router.route('/createquotation/').post(protect, authorize('pharmacist'), createNewQuotation);

router
	.route('/:id')
	// Get Quotation
	.get(protect, authorize('user', 'doctor', 'admin'), getQuotation)
	// Update Quotation
	.put(protect, authorize('pharmacist'), updateQuotation)
	// Delete Quotation
	.delete(protect, deleteQuotation);

// Accept Quotation
router.route('/:id/accept').put(protect, acceptQuotation);

module.exports = router;
