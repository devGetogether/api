const express = require('express');
const Payments = require('../models/Payment');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getAllPayments,
	getPayment,
	createNewPayment,
	updatePayment,
	deletePayment,
} = require('../controllers/payments');

const router = express.Router({ mergeParams: true });

// Get all payments
router.route('/').get(protect, authorize('admin'), advancedResults(Payments), getAllPayments);

// Create new payment
router.route('/create').post(protect, createNewPayment);

router
	.route('/:paymentId')
	// Get payment
	.get(protect, getPayment)
	// Update payment
	.put(protect, updatePayment)
	// Delete payment
	.delete(protect, authorize('admin'), deletePayment);

module.exports = router;
