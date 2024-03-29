const mongoose = require('mongoose');

const eventPlannerSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	services: [
		{
			type: String,
			required: true,
		},
	],
	location: {
		type: String,
		required: true,
	},
	contactNumber: {
		type: String,
		required: true,
	},
	website: {
		type: String,
	},
	socialMedia: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const EventPlanner = mongoose.model('EventPlanner', eventPlannerSchema);

module.exports = EventPlanner;
