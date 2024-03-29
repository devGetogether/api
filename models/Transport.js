const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	eventName: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	vehicleType: {
		type: String,
		enum: ['Car', 'Bus', 'Van'],
		required: true,
	},
	capacity: {
		type: Number,
		required: true,
	},
	passengers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Passenger',
		},
	],
});

const Transport = mongoose.model('Transport', transportSchema);

module.exports = Transport;
