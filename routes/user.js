const express = require('express');
const {
	getAllUsers,
	getUser,
	createNewUser,
	updateUser,
	deleteUser,
	uploadUserPhoto,
	getMe,
	verifyEmail,
} = require('../controllers/users');

const Users = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

// Get all users
router.route('/').get(
	// protect,
	advancedResults(Users, '-password'),
	getAllUsers
);

// Create new user
router.route('/create').post(createNewUser);

// Get all of the user's information
router.route('/getme').get(protect, getMe);

router
	.route('/:id')
	// Get user
	.get(protect, getUser)
	// Update user
	.put(protect, updateUser)
	// Delete user
	.delete(
		protect,
		// authorize('admin'),
		deleteUser
	);

// Upload photo
router.route('/:id/photo').put(
	// protect,
	uploadUserPhoto
);

// Verify email
router.route('/verifyemail/').post(verifyEmail);

module.exports = router;
