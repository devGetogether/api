const mongoose = require('mongoose');

const barSchema = new mongoose.Schema({
	userID: {
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
	services: {
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

const Bar = mongoose.model('Bar', barSchema);

module.exports = Bar;
