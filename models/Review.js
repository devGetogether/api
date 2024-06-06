const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
	{
		vendorId: { type: String, required: true },
		vendorType: { type: String, required: true },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
		review: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 0,
			max: 5,
		},
	},
	{ timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
