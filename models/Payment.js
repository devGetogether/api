const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
	amount: {
		type: Number,
		required: true,
	},
	currency: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	images: [String],
	// Add more fields as needed
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
