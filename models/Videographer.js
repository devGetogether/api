const mongoose = require('mongoose');

const videographerSchema = new mongoose.Schema({
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

const Videographer = mongoose.model('Videographer', videographerSchema);

module.exports = Videographer;
