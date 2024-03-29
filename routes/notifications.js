const express = require('express');
const { getAllNotifications, markNotificationAsRead, getMyNotifications } = require('../controllers/notifications');

const Notifications = require('../models/Notification');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({
	mergeParams: true,
});

const { protect, authorize } = require('../middleware/auth');

// Get all Notifications
router.route('/').get(protect, advancedResults(Notifications), getAllNotifications);

// Get my notifications
router.route('/mine').get(protect, getMyNotifications);

// Mark notification as read
router.route('/:id').put(protect, markNotificationAsRead);

module.exports = router;
