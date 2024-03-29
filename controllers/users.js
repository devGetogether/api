const User = require('../models/User');
const Prescriptions = require('../models/Prescriptions');
const MedicalHistory = require('../models/MedicalHistory');
const Quotations = require('../models/Quotation');
const Appointments = require('../models/Appointments');
const Notifications = require('../models/Notification');
const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const advancedResults = require('../middleware/advancedResults');
const path = require('path');
const sendEmail = require('../utils/sendEmail');
const Users = require('../models/User');

// @desc     Get all users
// @route    GET /api/v1/users
// @access   Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
	console.log('Getting all users');
	// const searchText = req.body.searchText;
	// console.log(`Search Text: ${searchText}`);
	// const user = await User.find({
	// 	name: new RegExp(searchText, 'i'),
	// });

	return res.status(200).json(res.advancedResults);
});

// @desc     Register new User
// @route    POST /api/v1/users
// @access   Private
exports.createNewUser = asyncHandler(async (req, res, next) => {
	const { firstName, lastName, gender, dateOfBirth, email, phoneNumber, address, idNumber, role, password } = req.body;

	// Check user
	const user = await User.findOne({ idNumber: idNumber });

	// if user exists return error
	if (user) {
		return next(new errorResponse('An account with those details already exists', 400));
	}

	// Create new user
	const newUser = await User.create({
		firstName,
		lastName,
		gender,
		dateOfBirth,
		email,
		phoneNumber,
		address,
		idNumber,
		role,
		password,
	});

	// send welcome email
	console.log('Sending Email:'.yellow.bold);
	try {
		await sendEmail({
			user_email: newUser.email,
			user_name: newUser.firstName,
			subject: 'Welcome to Nexacura',
			emailType: 'welcomeEmail',
		});
	} catch (err) {
		console.log(err);
	}

	// Generate token response
	// sendTokenResponse(newUser, 200, res);

	// send response
	res.status(200).json({ success: true, message: 'User created' });
});

// @desc    Get single user
// @route   GET /v1/users/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {
	// set up the selected fields
	let selectedfields = '';
	req.query.select ? (selectedfields = req.query.select.split(',').join(' ')) : (selectedfields = '-password');

	// console.log(selectedfields);

	console.log(req.user._id.equals(req.params.id));

	// check if its the user's profile or is admin or is the patient's doctor
	if (!req.user._id.equals(req.params.id))
		if (!req.user.role.includes('admin'))
			if (!req.user.role.includes('doctor')) {
				return next(new errorResponse('Not authorized to view this profile', 401));
			}

	const user = await User.findById(req.params.id)
		.select(selectedfields)
		.populate({
			path: 'doctors',
			select:
				'specializations professionalContactInformation isVerified qualifications professionalMemberships photo consultationFee',
			populate: {
				path: 'details',
				select: 'firstName lastName address email phoneNumber',
			},
		})
		.populate({
			path: 'doctorRequests',
			select:
				'specializations professionalContactInformation isVerified qualifications professionalMemberships photo consultationFee',
			populate: {
				path: 'details',
				select: 'firstName lastName address email phoneNumber',
			},
		});

	if (!user) {
		return next(new errorResponse(`User not found with id ${req.params.id}`, 404));
	}

	// console.log(req.doctor._id);

	// console.log(user.doctors);

	// if doctor is not the patient's doctor return error that say ask the patient to add you as a doctor
	if (!req.user._id.equals(req.params.id) && !req.user.role.includes('admin')) {
		if (req.user.role.includes('doctor')) {
			// get the user's doctors
			const doctors = await User.findById(req.params.id).select('doctors doctorRequests');
			console.log(doctors.doctors);
			// check if the doctor is in the patient's doctors list
			if (!doctors.doctors.includes(req.doctor._id)) {
				// send email to patient to give access to doctor
				try {
					// add doctor to patient's requesting doctors list
					const isDoctorRequested = doctors.doctorRequests.includes(req.doctor._id);

					if (!isDoctorRequested) {
						console.log('Adding doctor to patient requesting doctors list');

						user.doctorRequests.push(req.doctor._id);
						await user.save();

						// send email to patient notifying them of the attempt to access their medical information
						// await sendEmail({
						// 	user_email: user.email,
						// 	user_name: req.user.firstName,
						// 	doctor_name: `Dr ${req.doctor.details.firstName} ${req.doctor.details.lastName}`,
						// 	subject: 'Request for access to your medical information',
						// 	emailType: 'requestAccessEmail',
						// });

						// return error notification to the doctor
						return next(
							new errorResponse(
								'A request has been sent to the patient to give you access to their medical information',
								401
							)
						);
					}
				} catch (err) {
					console.log(err);
					return next(new errorResponse('Server error, try again later', 500));
				}
			}
		} else return next(new errorResponse('Not authorized to view this.', 401));
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

// @desc     Update user
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

	if (req.user.id !== user.id) return next(new errorResponse('Not authorized to upload image, Please Log In', 400));

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
		return next(new errorResponse(`Please upload an image less that ${process.env.MAX_IMAGE_SIZE / 1000000}MB`, 400));
	}
});

// @desc	 Add User Doctor
// @route	 POST /api/v1/users/:id/privacy/:doctor
// @access	 Private
exports.addUserDoctors = asyncHandler(async (req, res, next) => {
	console.log('modifyUserDoctors');
	const user = await User.findById(req.params.id).select('-password');
	if (!user) {
		return next(new errorResponse(`User not found with id ${req.params.id}`, 404));
	}

	console.log(user.doctors);
	// check if the doctor is not already on the list
	if (!user.doctors.includes(req.params.doctor)) user.doctors.push(req.params.doctor);

	// remove doctor from request list
	if (user.doctorRequests.includes(req.params.doctor))
		user.doctorRequests = user.doctorRequests.pull(req.params.doctor);

	// save user
	await user.save();

	// create a notification
	await Notification.create({
		user: req.params.id,
		message: `You have added a new doctor to your list`,
	});

	// send the doctor a notification
	// try {
	// 	const doctor = await Doctor.findById(req.params.doctor).select(
	// 		'professionalContactInformation'
	// 	);

	// 	if (!doctor) {
	// 		return next(
	// 			new errorResponse(`Doctor not found with id ${req.params.doctor}`, 404)
	// 		);
	// 	}

	// 	// send email
	// } catch (error) {}

	// send doctor list and request list back to user
	res.status(200).json({
		success: true,
		data: {},
	});

	// res.status(200).json({ success: true, data: newUser });
});

// @desc	 remove User Doctor
// @route	 PUT /api/v1/users/:id/privacy/:doctor
// @access	 Private
exports.removeUserDoctors = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id).select('-password');
	if (!user) {
		return next(new errorResponse(`User not found with id ${req.params.id}`, 404));
	}

	console.log(user.doctors);
	// check if the doctor is not already on the list
	if (user.doctors.includes(req.params.doctor)) user.doctors.pull(req.params.doctor);

	// save user
	await user.save();

	// create a notification
	await Notification.create({
		user: req.params.id,
		message: `You have deleted a doctor from your list`,
	});

	// send the doctor a notification
	// try {
	// 	const doctor = await Doctor.findById(req.params.doctor).select(
	// 		'professionalContactInformation'
	// 	);

	// 	if (!doctor) {
	// 		return next(
	// 			new errorResponse(`Doctor not found with id ${req.params.doctor}`, 404)
	// 		);
	// 	}

	// 	// send email
	// } catch (error) {}

	// send doctor list and request list back to user
	res.status(200).json({
		success: true,
		data: {},
	});

	// res.status(200).json({ success: true, data: newUser });
});

// @desc	 Get Information about the current user
// @route	 GET /api/v1/users/getme
// @access	 Private
exports.getMe = asyncHandler(async (req, res, next) => {
	// get user information and populate all the fields
	const userDetails = await User.findById(req.user.id)
		.populate({
			path: 'doctors',
			select: 'specializations professionalContactInformation isVerified qualifications professionalMemberships',
			populate: {
				path: 'details',
				select: 'name address email phoneNumber',
			},
		})
		.select('-password')
		.sort({ 'medicalDetails.records.date': -1 });
	// get medical details
	const medicalDetails = await MedicalHistory.find({ patient: req.user.id })
		.populate({
			path: 'doctor',
			select: 'details specializations professionalContactInformation photo',
			populate: {
				path: 'details',
				select: 'firstName lastName',
			},
		})
		.populate({
			path: 'prescription',
			select: 'prescriptionDetails medication fulfillmentDetails createdAt dosage notes',
			populate: {
				path: 'prescriptionDetails.doctor',
				select: 'details specializations professionalContactInformation',
				populate: {
					path: 'details',
					select: 'firstName lastName',
				},
			},
			populate: {
				path: 'prescriptionDetails.visit',
				select: 'patient doctor institution',
			},
		})
		.populate({
			path: 'institution',
			select: 'name location contact',
		})
		.sort({ visitDate: -1 });
	// get prescriptions
	const prescriptions = await Prescriptions.find({ patient: req.user.id })
		.populate({
			path: 'prescriptionDetails.doctor',
			select: 'details specializations professionalContactInformation photo',
			populate: {
				path: 'details',
				select: 'firstName lastName photo',
			},
		})
		.populate({
			path: 'fulfillmentDetails.pharmacy',
			select: 'name location contactInformation isVerified',
		})
		.sort({ created: -1 });
	// get appointments
	const appointments = await Appointments.find({ patient: req.user.id })
		.populate({
			path: 'doctor',
			select: 'details specializations professionalContactInformation photo',
			populate: {
				path: 'details',
				select: 'firstName lastName photo gender',
			},
		})
		.populate({
			path: 'location',
			select: 'name location contact type services',
		})
		.sort({ date: -1 });
	// const prescriptions = await advancedResults(Prescriptions, [
	// 	{
	// 		path: 'patient',
	// 		select: 'firstName lastName',
	// 	},
	// 	{
	// 		path: 'prescriptionDetails.doctor',
	// 		select: 'details specializations professionalContactInformation',
	// 		populate: {
	// 			path: 'details',
	// 			select: 'firstName lastName',
	// 		},
	// 	},
	// 	{
	// 		path: 'fulfillmentDetails.pharmacy',
	// 		select: 'name location contactInformation isVerified',j
	// 	},
	// ]);
	// const appointments = await getAllAppointments(req, res, next);

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

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	// Create Token
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	const { address, createdAt, dateOfBirth, email, gender, idNumber, firstName, phoneNumber, lastName, _id, role } =
		user;

	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({
			success: true,
			loggedInUser: {
				// address,
				// createdAt,
				// dateOfBirth,
				email,
				gender,
				// idNumber,
				firstName,
				// phoneNumber,
				lastName,
				_id,
				role,
				accessToken: token,
			},
			token,
		});
};

//
