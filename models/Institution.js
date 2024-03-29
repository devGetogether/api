const mongoose = require('mongoose');

const InstitutionsSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	contact: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: [
			'General Hospital',
			'Government Hospital',
			'Private Hospital',
			'Specialist Hospital',
			'Infectious Diseases Hospital',
			'Clinic',
			'Emergency Clinic',
			'Maternity Clinic',
			'Pharmacy',
			'Laboratory',
			'Radiology',
			'Optics',
			'Dental',
			'Physiotherapy',
			'Surgery',
			'Psychiatry',
			'Pediatrics',
			'Diagnostic Center',
			'Medical Centre',
			'Other',
		],
		required: true,
	},
	services: [
		{
			type: String,
			required: true,
		},
	],
	workingHours: [
		{
			day: {
				type: String,
				required: true,
			},
			open: {
				type: String,
				required: true,
			},
			close: {
				type: String,
				required: true,
			},
		},
	],
	created: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Institutions', InstitutionsSchema);
