const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema(
	{
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		details: {
			type: String,
			// required: true,
		},
		location: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		portfolio: {
			type: String,
			default: '',
		},
		servedAreas: {
			type: [String],
			default: [''],
		},
		cpp: {
			type: Number,
			// required: true,
		},
		services: {
			type: [{ name: String, description: String }],
			// required: true,
		},
		maxCapacity: {
			type: Number,
			// required: true,
		},
		minCapacity: {
			type: Number,
			// required: true,
		},
		rating: {
			type: Number,
			default: 0,
		},
		active: {
			type: Boolean,
			default: false,
		},
		images: [String],
	},
	{ timestamps: true }
);

const Transport = mongoose.model('Transport', transportSchema);

module.exports = Transport;
