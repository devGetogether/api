const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;