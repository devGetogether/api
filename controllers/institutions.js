const Institutions = require('../models/Institution');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get all institutions
// @route     GET /api/v1/institutions
// @access    Private
exports.getAllMedicalInstitutions = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc      Get single institution
// @route     GET /api/v1/institutions/:id
// @access    Private
exports.getMedicalInstitution = asyncHandler(async (req, res, next) => {
	const institution = await Institutions.findById(req.params.id);

	if (!institution) {
		return next(new ErrorResponse(`Institution not found with id of ${req.params.id}`, 404));
	}

	res.status(200).json({ success: true, data: institution });
});

// @desc      Create new institution
// @route     POST /api/v1/institutions
// @access    Private
exports.createNewMedicalInstitution = asyncHandler(async (req, res, next) => {
	const institution = await Institutions.create(req.body);

	res.status(201).json({
		success: true,
		data: institution,
	});
});

// @desc      Update institution
// @route     PUT /api/v1/institutions/:id
// @access    Private
exports.updateMedicalInstitution = asyncHandler(async (req, res, next) => {
	const institution = await Institutions.findById(req.params.id);

	if (!institution) {
		return next(new ErrorResponse(`Institution not found with id of ${req.params.id}`, 404));
	}

	const updatedInstitution = await Institutions.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, data: updatedInstitution });
});

// @desc      Delete institution
// @route     DELETE /api/v1/institutions/:id
// @access    Private
exports.deleteMedicalInstitution = asyncHandler(async (req, res, next) => {
	const institution = await Institutions.findById(req.params.id);

	if (!institution) {
		return next(new ErrorResponse(`Institution not found with id of ${req.params.id}`, 404));
	}

	institution.remove();

	res.status(200).json({ success: true, data: {} });
});
