const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Payment = require('../models/Payment');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Public
exports.getAllPayments = asyncHandler(async (req, res, next) => {
	try {
		const payments = await Payment.find();
		res.status(200).json({ success: true, data: payments });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Public
exports.getPayment = asyncHandler(async (req, res, next) => {
	try {
		const payment = await Payment.findById(req.params.id);
		if (!payment) {
			return next(new errorResponse(`Payment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: payment });
	} catch (err) {
		next(err);
	}
});

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
exports.createNewPayment = asyncHandler(async (req, res, next) => {
	try {
		const payment = await Payment.create(req.body);
		res.status(201).json({ success: true, data: payment });
	} catch (err) {
		next(err);
	}
});

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
exports.updatePayment = asyncHandler(async (req, res, next) => {
	try {
		const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!payment) {
			return next(new errorResponse(`Payment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: payment });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private
exports.deletePayment = asyncHandler(async (req, res, next) => {
	try {
		const payment = await Payment.findByIdAndDelete(req.params.id);
		if (!payment) {
			return next(new errorResponse(`Payment not found with id ${req.params.id}`, 404));
		}
		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
