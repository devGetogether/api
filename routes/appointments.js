const express = require('express');
const {
	getAllAppointments,
	getAppointment,
	createNewAppointment,
	updateAppointment,
	deleteAppointment,
	cancelAppointment,
	rescheduleAppointment,
	cancelAllAppointments,
} = require('../controllers/appointments');

const Appointments = require('../models/Appointments');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

// Get all Appointments
router.route('/').get(
	protect,
	advancedResults(Appointments, [
		{
			path: 'patient',
			select: 'firstName lastName photo email phoneNumber',
		},
		{
			path: 'doctor',
			select: 'details specializations professionalContactInformation',
			populate: {
				path: 'details',
				select: 'firstName lastName',
			},
		},
		{
			path: 'location',
			select: 'name location contact type services',
		},
	]),
	getAllAppointments
);

// Create new Appointment
router
	.route('/createappointment')
	.post(protect, authorize('user', ' doctor'), createNewAppointment);

router
	.route('/:id')
	// Get Appointment
	.get(protect, authorize('user', 'doctor', 'admin'), getAppointment)
	// Update Appointment
	.put(protect, authorize('user', 'doctor', 'admin'), updateAppointment)
	// Delete Appointment
	.delete(protect, authorize('user', 'doctor', 'admin'), deleteAppointment);

// Cancel Appointment
router
	.route('/cancel/:id')
	.put(protect, authorize('user', 'doctor'), cancelAppointment);

// Cancel All Appointments
router
	.route('/cancelall/:id')
	.put(protect, authorize('doctor'), cancelAllAppointments);

// Reschedule Appointment
router
	.route('/reschedule/:id')
	.put(protect, authorize('user'), rescheduleAppointment);

module.exports = router;
