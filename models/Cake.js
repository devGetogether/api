const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	flavor: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	supplier: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Cake = mongoose.model('Cake', cakeSchema);

module.exports = Cake;
