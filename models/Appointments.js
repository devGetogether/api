const mongoose = require('mongoose');

const AppointmentsSchema = new mongoose.Schema({
	patient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
		required: true,
	},
	doctor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Doctors',
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	position: {
		type: Number,
		required: true,
	},
	location: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Institutions',
		required: true,
	},
	doctorStartTime: {
		type: String,
		required: true,
	},
	doctorEndTime: {
		type: String,
		required: true,
	},
	notes: {
		type: String,
	},
	status: {
		type: String,
		enum: ['Confirmed', 'Rescheduled', 'Cancelled', 'Completed'],
		default: 'Confirmed',
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Appointments', AppointmentsSchema);
