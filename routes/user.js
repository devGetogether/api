const express = require('express');
const {
	getAllUsers,
	getUser,
	createNewUser,
	updateUser,
	deleteUser,
	uploadUserPhoto,
	addUserDoctors,
	removeUserDoctors,
	getMe,
} = require('../controllers/users');

const Users = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

// Get all users
router.route('/').get(
	// protect,
	advancedResults(
		Users,
		{
			path: 'doctors',
			select: 'specializations details',
			populate: {
				path: 'details',
				select: 'name address email phoneNumber',
			},
		},
		'-password'
	),
	getAllUsers
);

// Create new user
router.route('/register').post(createNewUser);

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

// Add User Doctor
router.route('/:id/privacy/:doctor').post(protect, addUserDoctors);

// Remove User Doctor
router.route('/:id/privacy/:doctor').get(protect, removeUserDoctors);

module.exports = router;
