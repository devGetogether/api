const mongoose = require('mongoose');

const decorSchema = new mongoose.Schema({
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
	services: {
		type: [String],
		required: true,
	},
	contact: {
		type: String,
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

const Decor = mongoose.model('Decor', decorSchema);

module.exports = Decor;
