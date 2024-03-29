const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
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
	contact: {
		type: String,
		required: true,
	},
	equipmentType: {
		type: String,
		required: true,
	},
	availableQuantity: {
		type: Number,
		required: true,
	},
	pricePerUnit: {
		type: Number,
		required: true,
	},
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
