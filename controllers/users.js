const User = require('../models/User');
const Notifications = require('../models/Notification');
const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

// @desc     Get all users
// @route    GET /api/v1/users
// @access   Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
	console.log('Getting all users');
	return res.status(200).json(res.advancedResults);
});

// @desc     Register new User
// @route    POST /api/v1/users
// @access   Private
exports.createNewUser = asyncHandler(async (req, res, next) => {
	const { firstName, lastName, email, phoneNumber, password } = req.body;

	// Check user
	const user = await User.findOne({ email: email });

	// if user exists return error
	if (user) {
		return next(new errorResponse('An account with those details already exists', 400));
	}

	// Create new user
	const newUser = await User.create({
		firstName,
		lastName,
		email,
		phoneNumber,
		password,
	});

	// get email verification token and expiry from the model
	newUser.verificationToken = Math.floor(100000 + Math.random() * 900000);
	newUser.verificationTokenExpires = Date.now() + 15 * 60 * 60 * 1000;
	await newUser.save();

	// send welcome email
	console.log('Sending Email:'.yellow.bold);
	try {
		await sendEmail({
			user_email: newUser.email,
			user_name: newUser.firstName,
			code: newUser.verificationToken,
			expiresIn: '15 Minutes',
			subject: 'Welcome to Getogether',
			emailType: 'emailVerification',
		});
	} catch (err) {
		console.log('Error sending email:'.red.bold);
		console.log(err);
	}
	// Generate token response
	// sendTokenResponse(newUser, 200, res);

	// send response
	res
		.status(200)
		.json({ success: true, message: 'User created. Check your email for verification code.' });
});

// @desc     Verify Email
// @route    GET /api/v1/users/verifyemail/:token
// @access   Private
exports.verifyEmail = asyncHandler(async (req, res, next) => {
	console.log('Verifying Email:'.yellow.bold);
	// get token from url
	const { code } = req.body;
	console.log('Token: ', code);

	// get user by token
	const user = await User.findOne({
		verificationToken: code,
		verificationTokenExpires: { $gt: Date.now() },
	});

	// if no user found
	if (!user) {
		return next(new errorResponse('Invalid token or token has expired', 400));
	}

	// set emailVerified to true
	user.emailVerified = true;
	user.emailVerificationToken = undefined;
	user.emailVerificationTokenExpires = undefined;

	// save user
	await user.save();

	// send response
	res
		.status(200)
		.json({ success: true, message: 'Email verified successfully. Welcome to the family' });

	// // send welcome email
	// console.log('Sending Email:'.yellow.bold);
	// try {
	// 	await sendEmail({
	// 		user_email: user.email,
	// 		user_name: user.firstName,
	// 		subject: 'Welcome to Getogether',
	// 		emailType: 'welcome',
	// 	});
	// } catch (err) {
	// 	console.log(err);
	// }
});

// @desc    Get single user
// @route   GET /v1/users/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {
	// set up the selected fields
	let selectedfields = '';
	req.query.select
		? (selectedfields = req.query.select.split(',').join(' '))
		: (selectedfields = '-password');

	console.log(req.user._id.equals(req.params.id));
	const user = await User.findById(req.params.id).select(selectedfields);

	if (!user) {
		return next(new errorResponse(`User not found`, 404));
	}

	res.status(200).json({ success: true, data: user });
});

// @desc     Update user
// @route    UPDATE /v1/users/:id
// @access   Private
exports.updateUser = asyncHandler(async (req, res, next) => {
	if (!req.user._id.equals(req.params.id) && !req.user.role.includes('admin'))
		return next(new errorResponse('Not authorized to update this profile', 401));

	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new errorResponse(`User not found with id ${req.params.id}`, 404));
	}

	const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, data: newUser });
});

// @desc     Delete user
// @route    DELETE /v1/users/:id
// @access   Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new errorResponse(`User not found with id ${req.params.id}`, 404));
	}

	user.remove();

	res.status(200).json({ success: true, data: {} });
});

//  @desc       Upload photo
//  @route      /api/v1/user/:id/photo
//  @access     Private
exports.uploadUserPhoto = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	console.log(user);

	if (!user) {
		return next(new errorResponse(`User not found with id: ${req.params.id}`, 404));
	}

	console.log(req.user.id);
	console.log(user.id);

	if (req.user.id !== user.id)
		return next(new errorResponse('Not authorized to upload image, Please Log In', 400));

	if (!req.files) {
		return next(new errorResponse('Please upload a file', 400));
	}

	const file = req.files.file || req.files.image;

	// // Ensure file is an image
	if (!file.mimetype.startsWith('image')) {
		return next(new errorResponse('Please upload an image file', 400));
	}

	// // Check file size
	if (file.size > process.env.MAX_IMAGE_SIZE) {
		return next(
			new errorResponse(
				`Please upload an image less that ${process.env.MAX_IMAGE_SIZE / 1000000}MB`,
				400
			)
		);
	}
});

// @desc	 Get Information about the current user
// @route	 GET /api/v1/users/getme
// @access	 Private
exports.getMe = asyncHandler(async (req, res, next) => {
	// get user information and populate all the fields
	const userDetails = await User.findById(req.user.id).select('-password');

	return res.status(200).json({
		success: true,
		data: {
			userDetails,
			medicalDetails,
			prescriptions,
			appointments,
		},
	});
});
