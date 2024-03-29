const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const mongoose = require('mongoose');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		// Set token from Bearer token in header
		token = req.headers.authorization.split(' ')[1];
	}

	// Set token from cookie

	// else if (req.cookies.token) {
	//     token = req.cookies.token
	// }

	// Make sure token exists
	if (!token) return next(new errorResponse('Not authorized to access this, check your credentials', 401));

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// attach use to request
		req.user = await User.findById(decoded.id);

		// attach other role details to request
		// if (req.user.role.includes('doctor')) {
		// 	req.doctor = await Doctors.findOne({
		// 		details: mongoose.Types.ObjectId(decoded.id),
		// 	}).populate('details');
		// }

		// Verify membership status
		if (req.user.role === 'USER' && !req.user.membershipStatus.active)
			return next(new errorResponse('Not authorized to access this, check membership status', 401));

		next();
	} catch (error) {
		console.log(error);
		return next(new errorResponse('Server Error, try again later', 500));
	}
});

// Grant access to specific roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!req.user.role.some((role) => roles.includes(role)))
			return next(new errorResponse('Not authorized to access this, check your credentials', 401));

		next();
	};
};
