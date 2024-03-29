const express = require('express');
const {
	login,
	forgotPassword,
	resetPassword,
	updateUser,
	updatePassword,
	activateUser,
	requestVerification,
	verifyContacts,
} = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { verify } = require('crypto');

router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/reset/:resettoken', resetPassword);
router.put('/update/:id', protect, updatePassword);
// Authorize user
router.route('/activate/:id').put(protect, authorize('admin'), activateUser);
// request verification of user contacts
router
	.route('/requestverification/:id/:type')
	.get(protect, requestVerification);

// verify user contacts
router.route('/verifycontact/:id/:type').post(protect, verifyContacts);

module.exports = router;
