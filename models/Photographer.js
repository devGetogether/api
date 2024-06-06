const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema(
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
		services: {
			type: [{ name: String, description: String, price: Number }],
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

const Photographer = mongoose.model('Photographer', photographerSchema);

module.exports = Photographer;
