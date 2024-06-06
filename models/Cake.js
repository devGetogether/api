const { size } = require('lodash');
const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema(
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
		cakeTypes: {
			type: [{ name: String, description: String, size: String, price: Number }],
			required: true,
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

const Cake = mongoose.model('Cake', cakeSchema);

module.exports = Cake;
