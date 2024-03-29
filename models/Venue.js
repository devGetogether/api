const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	capacity: {
		type: Number,
		required: true,
	},
	amenities: {
		type: [String],
		required: true,
	},
	contact: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	website: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
