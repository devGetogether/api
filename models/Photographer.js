const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	specialty: {
		type: String,
		required: true,
	},
	portfolio: {
		type: [String],
		required: true,
	},
	rating: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Photographer = mongoose.model('Photographer', photographerSchema);

module.exports = Photographer;
