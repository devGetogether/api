const Appointments = require('../models/Appointments');
const Users = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { sendEmail } = require('../utils/sendEmail');

// @desc      Get all appointments
// @route     GET /api/v1/appointments
// @access    Private
exports.getAllAppointments = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc      Get single appointment
// @route     GET /api/v1/appointments/:id
// @access    Private
exports.getAppointment = asyncHandler(async (req, res, next) => {
	const appointment = await Appointments.findById(req.params.id)
		.populate({ path: 'patient', select: 'firstName lastName email photo' })
		.populate('doctor')
		.populate('location');

	if (!appointment) {
		return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
	}

	res.status(200).json({ success: true, data: appointment });
});

// @desc      Create new appointment
// @route     POST /api/v1/appointments
// @access    Private
exports.createNewAppointment = asyncHandler(async (req, res, next) => {
	const patient = await Users.findById(req.body.patient);

	if (!patient) {
		return next(new ErrorResponse(`Patient not found with id of ${req.user.id}`, 404));
	}

	const doctor = await Doctors.findById(req.body.doctor).populate({
		path: 'details',
		select: 'firstName lastName',
	});

	if (!doctor) {
		return next(new ErrorResponse(`Doctor not found with id of ${req.user.id}`, 404));
	}

	// Get count of appointments for the doctor
	const count = await Appointments.countDocuments({
		doctor: req.body.doctor,
		location: req.body.location,
		date: req.body.date,
	});

	console.log(doctor.overallAvailability);

	// Check if the doctor is available
	if (
		!doctor.overallAvailability
		//check if the doctor is available on the day
	) {
		return next(
			new ErrorResponse(`Sorry Dr ${doctor.details.firstName} ${doctor.details.lastName} is not available`, 400)
		);
	}

	//get the day of the week
	const day = new Date(req.body.date).toString().slice(0, 3).toLowerCase();
	// find the index of the object that has the location on the day array
	const index = doctor.availability[day].findIndex((item) => item.location.toString() === req.body.location);

	console.log(index);

	console.log(doctor.availability[day][index].available);
	// check if the doctor is available on that day
	if (!doctor.availability[day][index].available) {
		return next(
			new ErrorResponse(
				`Sorry Dr ${doctor.details.firstName} ${doctor.details.lastName} is not available on the day`,
				400
			)
		);
	}

	// Check if the doctor has more than max appointments
	if (count >= doctor.maxAppointments) {
		return next(
			new ErrorResponse(
				`Doctor with id ${req.body.doctor} has reached the maximum number of appointments for the day`,
				400
			)
		);
	}

	console.log(doctor.availability[day][index].time.start);
	console.log(doctor.availability[day][index].time.end);

	const appointment = await Appointments.create({
		patient: req.body.patient,
		doctor: req.body.doctor,
		location: req.body.location,
		date: req.body.date,
		doctorStartTime: doctor.availability[day][index].time.start,
		doctorEndTime: doctor.availability[day][index].time.end,
		position: count + 1,
	});

	res.status(201).json({
		success: true,
		data: appointment,
	});
});

// @desc      Update appointment
// @route     PUT /api/v1/appointments/:id
// @access    Private
exports.updateAppointment = asyncHandler(async (req, res, next) => {
	const appointment = await Appointments.findById(req.params.id);

	if (!appointment) {
		return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
	}

	console.log(appointment.patient);
	console.log(req.user.id);

	// Make sure user is appointment owner
	if (
		appointment.patient.toString() !== req.user.id &&
		appointment.doctor !== req.user.id &&
		req.user.role !== 'admin'
	) {
		return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this appointment`, 401));
	}

	const updatedAppointment = await Appointments.findByIdAndUpdate(
		req.params.id,
		{ notes: req.body.notes },
		{ new: true, runValidators: true }
	);

	res.status(200).json({ success: true, data: updatedAppointment });
});

// @desc      Delete appointment
// @route     DELETE /api/v1/appointments/:id
// @access    Private
exports.deleteAppointment = asyncHandler(async (req, res, next) => {
	const appointment = await Appointments.findById(req.params.id);

	if (!appointment) {
		return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
	}

	// Make sure user is appointment owner
	if (
		appointment.patient.toString() !== req.user.id ||
		(appointment.doctor !== req.user.id && req.user.role !== 'admin')
	) {
		return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this appointment`, 401));
	}

	await appointment.remove();

	res.status(200).json({ success: true, data: {} });
});

// @desc      Cancel appointment
// @route     PUT /api/v1/appointments/cancel/:id
// @access    Private
exports.cancelAppointment = asyncHandler(async (req, res, next) => {
	const appointment = await Appointments.findById(req.params.id);

	if (!appointment) {
		return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
	}

	// Make sure user is appointment owner
	if (
		appointment.patient.toString() !== req.user.id &&
		appointment.doctor !== req.user.id &&
		req.user.role !== 'admin'
	) {
		return next(new ErrorResponse(`User ${req.user.id} is not authorized to cancel this appointment`, 401));
	}

	const updatedAppointment = await Appointments.findByIdAndUpdate(
		req.params.id,
		{ status: 'Cancelled' },
		{ new: true, runValidators: true }
	);

	res.status(200).json({ success: true, data: updatedAppointment });
});

// @desc      Cancel all appointments
// @route     PUT /api/v1/appointments/cancel-all
// @access    Private
exports.cancelAllAppointments = asyncHandler(async (req, res, next) => {
	const appointments = await Appointments.find({
		doctor: req.params.id,
	}).populate({
		path: 'doctor',
		select: 'details',
	});

	if (!appointments) {
		return next(new ErrorResponse(`Appointments not found with doctor id of ${req.body.id}`, 404));
	}

	console.log(appointments[0].doctor.details);
	console.log(req.user.id);

	// Make sure user is authorized
	if (req.user.role !== 'admin' && appointments[0].doctor.details.toString() !== req.user.id) {
		return next(new ErrorResponse(`User ${req.user.id} is not authorized to cancel these appointments`, 401));
	}

	appointments.forEach(async (appointment) => {
		appointment.status = 'Cancelled';
		await appointment.save();
	});

	res.status(200).json({ success: true, data: appointments });
});

// @desc      Reschedule appointment
// @route     PUT /api/v1/appointments/reschedule/:id
// @access    Private
exports.rescheduleAppointment = asyncHandler(async (req, res, next) => {
	const appointment = await Appointments.findById(req.params.id).populate({
		path: 'doctor',
		select: 'details',
	});

	const doctor = await Doctors.findById(req.body.doctor);

	if (!appointment) {
		return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
	}

	// Make sure user is appointment owner
	if (
		appointment.patient.toString() !== req.user.id &&
		appointment.doctor.details.toString() !== req.user.id &&
		req.user.role !== 'admin'
	) {
		return next(new ErrorResponse(`User ${req.user.id} is not authorized to reschedule this appointment`, 401));
	}

	// Check if the doctor is available
	if (
		!doctor.overallAvailability
		//check if the doctor is available on the day
	) {
		return next(new ErrorResponse(`Doctor with id ${req.body.doctor} is not available on the day`, 400));
	}

	// Check if the doctor has more than max appointments
	if (count >= doctor.maxAppointments) {
		return next(
			new ErrorResponse(`Doctor with id ${req.body.doctor} has reached the maximum number of appointments`, 400)
		);
	}

	// Update Appointment
	const updatedAppointment = await Appointments.findByIdAndUpdate(
		req.params.id,
		{
			date: req.body.date,
			status: 'Rescheduled',
		},
		{ new: true, runValidators: true }
	);

	res.status(200).json({ success: true, data: updatedAppointment });
});
