const Notifications = require('../models/Notification');
const advancedResults = require('../middleware/advancedResults');
const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');

// @desc     Get all notifications
// @route    GET /api/v1/notifications
// @access   Private
exports.getAllNotifications = asyncHandler(async (req, res, next) => {
	console.log('Getting all notifications');

	return res.status(200).json(res.advancedResults);
});

// @desc     Get my notifications
// @route    GET /api/v1/notifications/mine
// @access   Private
exports.getMyNotifications = asyncHandler(async (req, res, next) => {
	console.log('Getting my notifications');

	let notifications;
	// if query has doctor, then get all notifications for that doctor
	if (req.query.doctor) notifications = await Notifications.find({ user: req.query.doctor });
	else notifications = await Notifications.find({ user: req.user.id });

	return res.status(200).json({
		success: true,
		data: notifications,
	});
});

// @desc     Mark notification as read
// @route    PUT /api/v1/notifications/:id
// @access   Private
exports.markNotificationAsRead = asyncHandler(async (req, res, next) => {
	console.log('Marking notification as read');
	const notification = await Notifications.findById(req.params.id);

	if (!notification) {
		return next(new errorResponse('Notification not found', 404));
	}

	notification.read = true;
	await notification.save();

	return res.status(200).json({
		success: true,
		data: notification,
	});
});
