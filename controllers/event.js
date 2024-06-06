const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');

const vendorPaths = [
	'vendors.av.id',
	'vendors.bar.id',
	'vendors.cake.id',
	'vendors.caterer.id',
	'vendors.decor.id',
	'vendors.dj.id',
	'vendors.entertainment.id',
	'vendors.equipment.id',
	'vendors.eventplanner.id',
	'vendors.floral.id',
	'vendors.makeup.id',
	'vendors.mc.id',
	'vendors.photographer.id',
	'vendors.security.id',
	'vendors.staff.id',
	'vendors.transport.id',
	'vendors.venue.id',
	'vendors.videographer.id',
];

// @desc    Get all Events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = asyncHandler(async (req, res, next) => {
	try {
		const events = await Event.find();
		res.status(200).json({ success: true, data: events });
	} catch (err) {
		next(err);
	}
});

// @desc    Get single Event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res, next) => {
	// check if the user is an admin or the owner of the event

	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return next(new errorResponse(`Event not found with id ${req.params.id}`, 404));
		}
		if (req.user.role.includes('admin') || req.user.id.equals(event.organizer._id)) {
			return next(new errorResponse(`You are not authorized to access this`, 401));
		}
		res.status(200).json({ success: true, data: event });
	} catch (err) {
		next(err);
	}
});

// @desc    Get all Events by User
// @route   GET /events/getEventsByUser
// @access  Private
exports.getUserEvents = asyncHandler(async (req, res, next) => {
	// console.log('Checking User Events');
	// console.log('ID: ', req.params.userID);
	try {
		// const events = await Event.find({ organizer: mongoose.Types.ObjectId(req.user._id) }).populate('');
		// console.log(events);

		// let query = Event.find({ organizer: mongoose.Types.ObjectId(req.user._id) });
		// vendorPaths.forEach((path) => {
		// 	query = query.populate({
		// 		path,
		// 		model: path.split('.')[2].charAt(0).toUpperCase() + path.split('.')[2].slice(1),
		// 	});
		// });

		// const events = await query;

		const events = await Event.find({ organizer: mongoose.Types.ObjectId(req.user._id) })
			.populate({
				path: 'vendors.av.id',
				select: 'name',
				model: 'AV',
			})
			.populate({
				path: 'vendors.bar.id',
				select: 'name',
				model: 'Bar',
			})
			.populate({
				path: 'vendors.cake.id',
				select: 'name',
				model: 'Cake',
			})
			.populate({
				path: 'vendors.caterer.id',
				select: 'name',
				model: 'Caterer',
			})
			.populate({
				path: 'vendors.decor.id',
				select: 'name',
				model: 'Decor',
			})
			.populate({
				path: 'vendors.dj.id',
				select: 'name',
				model: 'DJ',
			})
			.populate({
				path: 'vendors.entertainment.id',
				select: 'name',
				model: 'Entertainment',
			})
			.populate({
				path: 'vendors.equipment.id',
				select: 'name',
				model: 'Equipment',
			})
			.populate({
				path: 'vendors.eventplanner.id',
				select: 'name',
				model: 'EventPlanner',
			})
			.populate({
				path: 'vendors.floral.id',
				select: 'name',
				model: 'Floral',
			})
			.populate({
				path: 'vendors.makeup.id',
				select: 'name',
				model: 'MakeUp',
			})
			.populate({
				path: 'vendors.mc.id',
				select: 'name',
				model: 'MC',
			})
			.populate({
				path: 'vendors.photographer.id',
				select: 'name',
				model: 'Photographer',
			})
			.populate({
				path: 'vendors.security.id',
				select: 'name',
				model: 'Security',
			})
			.populate({
				path: 'vendors.staff.id',
				select: 'name',
				model: 'Staff',
			})
			.populate({
				path: 'vendors.transport.id',
				select: 'name',
				model: 'Transport',
			})
			.populate({
				path: 'vendors.venue.id',
				select: 'name',
				model: 'Venue',
			})
			.populate({
				path: 'vendors.videographer.id',
				select: 'name',
				model: 'Videographer',
			});

		console.log(events[0].vendors.bar);

		res.status(200).json({ success: true, data: events });
	} catch (err) {
		console.log(err);
		next(err);
	}
});

// @desc    Create Event
// @route   POST /api/events
// @access  Private
exports.createNewEvent = asyncHandler(async (req, res, next) => {
	req.body.userID = req.user.id;

	// // check for published event planner
	// const publishedEvent = await Event.findOne({ user: req.user.id });

	// // if there is a published event planner and the user is not an admin
	// if (publishedEvent) {
	// 	return res
	// 		.status(400)
	// 		.json({ success: false, message: 'User already has a Event Service registered.' });
	// }
	try {
		const event = await Event.create(req.body);

		// get all the user's events
		const events = await Event.find({ organizer: req.user.id });

		res.status(201).json({ success: true, data: events, message: 'Event created successfully' });
	} catch (err) {
		next(err);
	}
});

// @desc    Update Event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = asyncHandler(async (req, res, next) => {
	// check if the user is an admin or the owner of the event
	const event = await Event.findById(req.params.id);

	if (!event) {
		return next(new errorResponse(`Event not found with id ${req.params.id}`, 404));
	}

	console.log('User: ', req.user._id);
	console.log('Organizer: ', event.organizer);

	if (!req.user.role.includes('admin') && !req.user._id.equals(event.organizer)) {
		return next(new errorResponse(`You are not authorized to access this`, 401));
	}

	// update the event and save
	try {
		const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({ success: true, data: event, message: 'Event updated successfully' });
	} catch (err) {
		next(err);
	}
});

// @desc Add Vendor
// @route PUT /api/events/addVendor/:id
// @access Private
exports.addVendor = asyncHandler(async (req, res, next) => {
	try {
		const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!event) {
			return next(new errorResponse(`Event not found with id ${req.params.id}`, 404));
		}

		await event.save();
		res.status(200).json({ success: true, data: event });
	} catch (err) {
		next(err);
	}
});

// @desc    Delete Event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
	try {
		const event = await Event.findById(req.params.id);

		if (!event) {
			return next(new errorResponse(`Event not found with id ${req.params.id}`, 404));
		}

		// check if the user is an admin or the owner of the event
		if (req.user.role.includes('admin') || req.user.id.equals(event.organizer._id)) {
			return next(new errorResponse(`You are not authorized to access this`, 401));
		}

		await event.remove();

		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	}
});
