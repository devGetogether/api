const mongoose = require('mongoose');

const makeupArtistSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	specialization: {
		type: String,
		required: true,
	},
	experience: {
		type: Number,
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
	portfolio: {
		type: [String],
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const MakeupArtist = mongoose.model('MakeupArtist', makeupArtistSchema);

module.exports = MakeupArtist;
