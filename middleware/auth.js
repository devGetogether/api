const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const AV = require('../models/AV');
const Bar = require('../models/Bar');
const Cake = require('../models/Cake');
const Caterer = require('../models/Caterer');
const Decor = require('../models/Decor');
const DJ = require('../models/DJ');
const Entertainment = require('../models/Entertainment');
const Equipment = require('../models/Equipment');
const EventPlanner = require('../models/EventPlanner');
const Floral = require('../models/Florals');
const MakeUp = require('../models/MakeUp');
const MC = require('../models/MC');
const Photographer = require('../models/Photographer');
const Security = require('../models/Security');
const Staff = require('../models/Staff');
const Transport = require('../models/Transport');
const Venue = require('../models/Venue');
const Videographer = require('../models/Videographer');
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
	if (!token)
		return next(new errorResponse('Not authorized to access this, check your credentials', 401));

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// console.log(decoded);

		// attach use to request
		req.user = await User.findById(decoded.id);

		// attach other role details to request
		await this.populateRoles(req, decoded.id);

		// Verify membership status
		if (req.user.role === 'USER' && !req.user.membershipStatus.active)
			return next(new errorResponse('Not authorized to access this, check membership status', 401));

		next();
	} catch (error) {
		console.log(error);
		return next(
			new errorResponse(
				'Not authorized to access this, check your credentials. Try to Login in',
				401
			)
		);
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

exports.populateRoles = asyncHandler(async (req, id) => {
	console.log('Checking roles');
	// attach other role details to request
	try {
		let vendorRoles = [];

		if (req.user.role.includes('av'))
			vendorRoles = [...vendorRoles, { av: await AV.findOne({ userID: id }) }];
		if (req.user.role.includes('bar'))
			vendorRoles = [...vendorRoles, { bar: await Bar.findOne({ userID: id }) }];
		if (req.user.role.includes('cake'))
			vendorRoles = [...vendorRoles, { cake: await Cake.findOne({ userID: id }) }];
		if (req.user.role.includes('caterer'))
			vendorRoles = [...vendorRoles, { caterer: await Caterer.findOne({ userID: id }) }];
		if (req.user.role.includes('decor'))
			vendorRoles = [...vendorRoles, { decor: await Decor.findOne({ userID: id }) }];
		if (req.user.role.includes('dj'))
			vendorRoles = [...vendorRoles, { dj: await DJ.findOne({ userID: id }) }];
		if (req.user.role.includes('entertainment'))
			vendorRoles = [
				...vendorRoles,
				{ entertainment: await Entertainment.findOne({ userID: id }) },
			];
		if (req.user.role.includes('equipment'))
			vendorRoles = [...vendorRoles, { equipment: await Equipment.findOne({ userID: id }) }];
		if (req.user.role.includes('eventplanner'))
			vendorRoles = [...vendorRoles, { eventplanner: await EventPlanner.findOne({ userID: id }) }];
		if (req.user.role.includes('floral'))
			vendorRoles = [...vendorRoles, { floral: await Floral.findOne({ userID: id }) }];
		if (req.user.role.includes('makeUp'))
			vendorRoles = [...vendorRoles, { makeup: await MakeUp.findOne({ userID: id }) }];
		if (req.user.role.includes('mc'))
			vendorRoles = [...vendorRoles, { mc: await MC.findOne({ userID: id }) }];
		if (req.user.role.includes('photographer'))
			vendorRoles = [...vendorRoles, { photographer: await Photographer.findOne({ userID: id }) }];
		if (req.user.role.includes('security'))
			vendorRoles = [...vendorRoles, { security: await Security.findOne({ userID: id }) }];
		if (req.user.role.includes('staff'))
			vendorRoles = [...vendorRoles, { staff: await Staff.findOne({ userID: id }) }];
		if (req.user.role.includes('transport'))
			vendorRoles = [...vendorRoles, { transport: await Transport.findOne({ userID: id }) }];
		if (req.user.role.includes('venue'))
			vendorRoles = [...vendorRoles, { venue: await Venue.findOne({ userID: id }) }];
		if (req.user.role.includes('videographer'))
			vendorRoles = [...vendorRoles, { videography: await Videographer.findOne({ userID: id }) }];

		req.vendor = vendorRoles;

		// req.vendor = {
		// 	av: vendors.find((vendor) => vendor instanceof AV),
		// 	cake: vendors.find((vendor) => vendor instanceof Cake),
		// 	caterer: vendors.find((vendor) => vendor instanceof Caterer),
		// 	decor: vendors.find((vendor) => vendor instanceof Decor),
		// 	dj: vendors.find((vendor) => vendor instanceof DJ),
		// 	entertainment: vendors.find((vendor) => vendor instanceof Entertainment),
		// 	equipment: vendors.find((vendor) => vendor instanceof Equipment),
		// 	eventPlanner: vendors.find((vendor) => vendor instanceof EventPlanner),
		// 	floral: vendors.find((vendor) => vendor instanceof Floral),
		// 	makeUp: vendors.find((vendor) => vendor instanceof MakeUp),
		// 	mc: vendors.find((vendor) => vendor instanceof MC),
		// 	photographer: vendors.find((vendor) => vendor instanceof Photographer),
		// 	security: vendors.find((vendor) => vendor instanceof Security),
		// 	staff: vendors.find((vendor) => vendor instanceof Staff),
		// 	transport: vendors.find((vendor) => vendor instanceof Transport),
		// 	venue: vendors.find((vendor) => vendor instanceof Venue),
		// 	videographer: vendors.find((vendor) => vendor instanceof Videographer),
		// };
	} catch (error) {
		console.log(error);
	}
});
