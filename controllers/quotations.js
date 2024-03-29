const Quotations = require('../models/Quotation');
const Prescriptions = require('../models/Prescriptions');
const Pharmacies = require('../models/Pharmacies');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get all quotations
// @route     GET /api/v1/quotations
// @access    Private
exports.getAllQuotations = asyncHandler(async (req, res, next) => {
	return res.status(200).json(res.advancedResults);
});

// @desc      Get single quotation
// @route     GET /api/v1/quotations/:id
// @access    Private
exports.getQuotation = asyncHandler(async (req, res, next) => {
	const quotation = await Quotations.findById(req.params.id).populate('pharmacy').populate('prescription');

	if (!quotation) {
		return next(new ErrorResponse(`Quotation not found with id of ${req.params.id}`, 404));
	}

	res.status(200).json({ success: true, data: quotation });
});

// @desc      Create new quotation
// @route     POST /api/v1/quotations
// @access    Private
exports.createNewQuotation = asyncHandler(async (req, res, next) => {
	const prescription = await Prescriptions.findById(req.body.prescription);

	if (!prescription) {
		return next(new ErrorResponse(`Prescription not found with id of ${req.body.prescription}`, 404));
	}

	const pharmacy = await Pharmacies.findById(req.body.pharmacy);

	if (!pharmacy) {
		return next(new ErrorResponse(`Pharmacy not found with id of ${req.body.pharmacy}`, 404));
	}

	// Make sure user is part of the pharmacy
	if (!pharmacy.pharmacists.includes(req.user.id) && !pharmacy.chiefPharmacist.includes(req.user.id)) {
		return next(new ErrorResponse(`User ${req.user.id} is not authorized to create a quotation`, 401));
	}

	const quotation = await Quotations.create(req.body);

	res.status(201).json({
		success: true,
		data: quotation,
	});
});

// @desc      Update quotation
// @route     PUT /api/v1/quotations/:id
// @access    Private
exports.updateQuotation = asyncHandler(async (req, res, next) => {
	const quotation = await Quotations.findById(req.params.id);
	const pharmacy = await Pharmacies.findById(quotation.pharmacy);

	if (!quotation) {
		return next(new ErrorResponse(`Quotation not found with id of ${req.params.id}`, 404));
	}

	// Make sure user is part of the pharmacy
	if (!pharmacy.pharmacists.includes(req.user.id) && !pharmacy.chiefPharmacist.includes(req.user.id)) {
		return next(new ErrorResponse(`User ${req.user.id} is not authorized to create a quotation`, 401));
	}

	quotation.cost = req.body.cost;

	await quotation.save();

	res.status(200).json({ success: true, data: quotation });
});

// @desc      Delete quotation
// @route     DELETE /api/v1/quotations/:id
// @access    Private
exports.deleteQuotation = asyncHandler(async (req, res, next) => {
	const quotation = await Quotations.findById(req.params.id);
	const pharmacy = await Pharmacies.findById(quotation.pharmacy);

	if (!quotation) {
		return next(new ErrorResponse(`Quotation not found with id of ${req.params.id}`, 404));
	}

	if (!pharmacy) {
		return next(new ErrorResponse(`Pharmacy not found with id of ${quotation.pharmacy}`, 404));
	}

	// Make sure user is cheifPharmacist of the pharmacy
	if (!pharmacy.chiefPharmacist.includes(req.user.id)) {
		return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this quotation`, 401));
	}

	await quotation.remove();

	res.status(200).json({ success: true, data: {} });
});

// @desc      Accept quotation
// @route     PUT /api/v1/quotations/accept/:id
// @access    Private
exports.acceptQuotation = asyncHandler(async (req, res, next) => {
	const quotation = await Quotations.findById(req.params.id);

	if (!quotation) {
		return next(new ErrorResponse(`Quotation not found with id of ${req.params.id}`, 404));
	}

	// retrive prescription
	const prescription = await Prescriptions.findById(quotation.prescription);

	if (!prescription) {
		return next(new ErrorResponse(`Prescription not found with id of ${quotation.prescription}`, 404));
	}

	console.log(prescription.patient);
	console.log(req.user.id);

	// Make sure user is the owner of prescription
	if (prescription.patient.toString() !== req.user.id) {
		return next(new ErrorResponse(`User ${req.user.id} is not authorized to accept this quotation`, 401));
	}

	quotation.status = 'Accepted';

	await quotation.save();

	console.log(prescription.fulfillmentDetails.pharmacy);

	// update prescription status
	prescription.fulfillmentDetails.pharmacy = quotation.pharmacy;

	await prescription.save();

	res.status(200).json({ success: true, data: quotation });
});
