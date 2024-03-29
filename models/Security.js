const mongoose = require('mongoose');

const securityProviderSchema = new mongoose.Schema({
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

const SecurityProvider = mongoose.model('SecurityProvider', securityProviderSchema);

module.exports = SecurityProvider;
