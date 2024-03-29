const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
	pharmacy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Pharmacies',
		required: true,
	},
	prescription: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Prescriptions',
		required: true,
	},
	cost: {
		type: Number,
		required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Cancelled'],
        default: 'Pending',
    },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Quotations', QuotationSchema);
