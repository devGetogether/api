const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { populateRoles } = require('../middleware/auth');

// @desc     login User
// @route    POST /v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//   validate email and password
	if (!email || !password) {
		return next(new ErrorResponse('Please provide a valid email and password to log in', 400));
	}

	// Check for user
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}

	// Check if password matches
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}

	sendTokenResponse(user, 200, req, res);
});

// @desc    Update logged in user password
// @route   GET /api/auth/updatePassword
// access   Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id).select('+password');

	console.log(`Old User Password: ${req.body.currentPassword}`);
	console.log(`New User Password: ${req.body.newPassword}`);

	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse('Password is incorrect', 401));
	}

	console.log(`User Password: ${req.body.newPassword}`);

	user.password = req.body.newPassword;

	await user.save();

	// Send Password changed email
	console.log('Sending Email:'.yellow.bold);
	try {
		await sendEmail({
			user_email: user.email,
			user_name: user.firstName,
			subject: 'Password Changed!',
			emailType: 'passwordChange',
		});
	} catch (err) {
		console.log(err);
	}

	sendTokenResponse(user, 200, req, res);
});

// @desc    Create Password Reset tokens
// @route   POST /api/v1/auth/forgoPassword
// access   Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ idNumber: req.body.idNumber });

	if (!user) return next(new ErrorResponse('There is no user with that email', 404));

	const resetToken = await user.getResetPasswordToken();

	console.log(resetToken);

	await user.save({ validateBeforeSave: false });

	// Create reset url
	const resetUrl = `${req.protocol}://${req.get('host')}/auth/resetpassword/${resetToken}`.replace(
		' ',
		''
	);

	try {
		await sendEmail({
			user_email: user.email,
			subject: 'Password Reset Request',
			resetLink: resetUrl,
			emailType: 'passwordReset',
		});

		return res.status(200).json({ success: true, data: 'Email sent' });
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse('Email could not be sent'), 500);
	}
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// Get hashed token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) return next(new ErrorResponse('Invalid Token', 400));

	// Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	// Send pasword changed email
	console.log('Sending Email:'.yellow.bold);
	try {
		await sendEmail({
			user_email: user.email,
			user_name: user.firstName,
			subject: 'Password Changed!',
			emailType: 'passwordChange',
		});
	} catch (err) {
		console.log(err);
	}

	sendTokenResponse(user, 200, req, res);
});

// @desc     Activate User
// @route    PUT /v1/users/activate/:id
// @access   Private
exports.activateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new errorResponse(`User not found with id ${req.params.id}`, 404));
	}

	let accountStatus = 'ACTIVATED';

	if (user.active) {
		accountStatus = 'DEACTIVATED';
	}

	user.active = !user.active;

	// send email to notify that account status has changed
	console.log('Sending Email:'.yellow.bold);
	try {
		await sendEmail({
			user_email: user.email,
			user_name: user.firstName,
			accountStatus: accountStatus,
			subject: 'Account Status!',
			emailType: 'accountStatus',
		});
	} catch (err) {
		console.log(err);
	}

	const newUser = await user.save();

	res.status(200).json({ success: true, data: newUser });
});

// request for verification
// @desc     Request Verification
// @route    PUT /v1/users/request-verification/:id/:type
// @access   Private
exports.requestVerification = asyncHandler(async (req, res, next) => {
	user = await User.findById(req.params.id);

	if (!user) {
		return next(new errorResponse(`User not found with id ${req.params.id}`, 404));
	}

	// if verify type is phone or email and user contact is already verified return error
	if (req.params.type === 'phone' && user.phoneVerified)
		return next(new ErrorResponse(`User phone already verified`, 400));

	if (req.params.type === 'email' && user.emailVerified)
		return next(new ErrorResponse(`User email already verified`, 400));

	// generate verification code to send to the user depending on the verification type
	const verificationCode = Math.floor(100000 + Math.random() * 900000);

	// set time expiration for the verification code
	const verificationCodeExpiration = Date.now() + 10 * 60 * 1000;

	// hide some characters of the email
	const hiddenEmail = user.email.replace(/(?<=.{2}).(?=[^@]*?[^@]{2}@)/g, '*');

	// hide some characters in the user phone number

	// const hiddenPhone = user.phoneNumber.replace(
	// 	/(?<=\d{2})\d(?=\d{2})/g,
	// 	"*"
	// );

	// send email if type is email and sms if type is phone
	if (req.params.type === 'email') {
		// send verification code to the user
		console.log('Sending Verification Code:'.yellow.bold);
		try {
			await sendEmail({
				user_email: user.email,
				user_name: user.firstName,
				code: verificationCode,
				expiresIn: verificationCodeExpiration,
				subject: 'Verification Code!',
				emailType: 'emailVerification',
			});

			// save verification code and expiry to the user
			user.verificationToken = verificationCode;
			user.verificationTokenExpires = verificationCodeExpiration;
			await user.save({ validateBeforeSave: false });

			res.status(200).json({
				success: true,
				message: 'Verification code sent',
				contact: hiddenEmail,
			});
		} catch (err) {
			console.log(err);
			return next(new ErrorResponse('Verification failed, please try again later'), 500);
		}
	}
	// add other verification types here
	else {
	}
});

// @desc     Verify Contact
// @route    PUT /v1/auth/verifycontact/:id/:type
// @access   Private
exports.verifyContacts = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new errorResponse(`User not found with id ${req.params.id}`, 404));
	}

	// check if verification code is correct
	if (req.params.type === 'email') {
		console.log(req.body.code);
		console.log(user.emailVerificationToken);

		// check if verification token has expired
		if (user.emailVerificationTokenExpires < Date.now()) {
			return next(new ErrorResponse('Verification token has expired', 400));
		}

		if (user.emailVerificationToken !== req.body.code) {
			return next(new ErrorResponse('Invalid Verification Code', 400));
		}

		// change emailVerified to true
		user.emailVerified = true;
		user.emailVerificationToken = undefined;
	}
	// add other verification types here
	else {
	}

	// set verified to true
	user.verified = true;
	user.emailVerificationToken = undefined;
	user.emailVerificationTokenExpires = undefined;

	const newUser = await user.save({ validateBeforeSave: false });

	res.status(200).json({ success: true, message: 'Contact Information Verified' });
});

// @desc     Get User
// @route    GET auth/getMe
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	const { firstName, lastName, email, phoneNumber, _id, photo } = user;

	req.user = user;

	// other roles
	await populateRoles(req, user._id);
	console.log('Other Roles:'.yellow.bold);
	console.log(req.vendor);

	res
		.status(200)
		.json({
			success: true,
			user: {
				firstName,
				lastName,
				email,
				phoneNumber,
				_id,
				photo,
				vendor: req.vendor,
			},
		});
});

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, req, res) => {
	// destructure user

	const { firstName, lastName, email, phoneNumber, _id, photo } = user;

	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	req.user = user;

	// other roles
	await populateRoles(req, user._id);
	console.log('Other Roles:'.yellow.bold);
	console.log(req.vendor);
	// const roles = user.role;
	// console.log(req);

	// roles.forEach((role) => {
	// 	if (role !== 'user') {
	// 		console.log(role);
	// 		otherRoles.push(req.vendor[role]);
	// 	}
	// });

	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({
			success: true,
			user: {
				firstName,
				lastName,
				email,
				phoneNumber,
				_id,
				photo,
				accessToken: token,
				vendor: req.vendor,
			},

			token,
		});
};
