const express = require('express');

const {
	getAllMedicalInstitutions,
	getMedicalInstitution,
	createNewMedicalInstitution,
	updateMedicalInstitution,
	deleteMedicalInstitution,
} = require('../controllers/institutions');

const MedicalInstitutions = require('../models/Institution');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({
	mergeParams: true,
});

const { protect, authorize } = require('../middleware/auth');

// Get all MedicalInstitutions
router.route('/').get(advancedResults(MedicalInstitutions), getAllMedicalInstitutions);

// Create new MedicalInstitution
router.route('/createinstitution').post(protect, authorize('admin'), createNewMedicalInstitution);

router
	.route('/:id')
	// Get MedicalInstitution
	.get(getMedicalInstitution)
	// Update MedicalInstitution
	.put(protect, authorize('admin'), updateMedicalInstitution)
	// Delete MedicalInstitution
	.delete(protect, authorize('admin'), deleteMedicalInstitution);

module.exports = router;
