const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Define Users schema
const UsersSchema = new mongoose.Schema(
	{
		photo: {
			type: String,
			default: 'user-no-photo.jpg',
		},
		role: {
			type: [String],
			enum: [
				'user',
				'admin',
				'caterer',
				'beverage_service_provider',
				'event_planner',
				'mc',
				'venue_service_provider',
				'photographer',
				'videographer',
				'entertainment_service_provider',
				'staffing_service_provider',
				'floral_service_provider',
				'decor_service_provider',
				'equipment_rental_service_provider',
				'transportation_service_provider',
				'virtual_experience_provider',
				'miscellaneous_service_provider',
			],
			required: true,
			default: ['user'],
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			enum: ['Male', 'Female'],
			required: true,
		},
		dateOfBirth: {
			type: Date,
			required: true,
		},
		idNumber: {
			type: String,
			required: true,
			unique: true,
			// Regex pattern for Zimbabwean ID number
			match: /^([0-9]{2})-([0-9]{7})-([A-Z])-([0-9]){2}$/,
		},
		userVerified: {
			type: Boolean,
			default: false,
		},
		address: {
			number: { type: String, default: '' },
			surburb: { type: String, default: '' },
			city: { type: String, default: '' },
			country: {
				type: String,
				default: 'Zimbabwe',
			},
		},
		email: {
			type: String,
			unique: true,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: String,
		emailVerificationTokenExpires: Date,
		password: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		phoneNumberVerified: {
			type: Boolean,
			default: false,
		},
		phoneNumberVerificationToken: String,
		phoneNumberVerificationTokenExpires: Date,
		occupation: {
			type: String,
			default: '',
		},
		// medically relevant details
		medicalDetails: {
			bloodType: {
				type: String,
				bloodType: {
					type: String,
					enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
				},
			},
			hieght: {
				type: Number,
			},
			// array of allergies
			allergies: [
				{
					type: String,
				},
			],
			records: [
				{
					date: { type: Date, default: Date.now },
					heartRate: {
						value: { type: Number },
						notes: { type: String },
					},

					bloodPressure: {
						Systolic: { type: Number },

						Diastolic: { type: Number },

						notes: { type: String },
					},

					BSL: {
						value: { type: Number },
						notes: { type: String },
					},

					weight: { type: Number },

					bodyTemperature: {
						value: { type: Number },
						notes: { type: String },
					},

					// full blood count
					// CBC: {
					// 	RBC: {
					// 		value: { type: String },
					// 		notes: { type: String },
					// 	},
					// 	Hemoglobin: {
					// 		value: { type: String },
					// 		notes: { type: String },
					// 	},
					// 	WBC: {
					// 		value: { type: String },
					// 		notes: { type: String },
					// 	},
					// 	Hematocrit: {
					// 		value: { type: String },
					// 		notes: { type: String },
					// 	},
					// 	Platelet: {
					// 		value: { type: String },
					// 		notes: { type: String },
					// 	},
					// },
				},
			],
		},
		doctors: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Doctors',
			},
		],
		// doctors requesting to be added to the user's list
		doctorRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Doctors',
			},
		],
		pharmacies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Pharmacies',
			},
		],
		active: { type: Boolean, default: true },
		// fullPermissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctors' }],
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
);

// Encrypt password using bcrypt
UsersSchema.pre('save', async function (next) {
	if (!this.isModified('password')) next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UsersSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match user entered password to hashed password in database
UsersSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Set Object and Json property to true. Default is set to false
UsersSchema.set('toObject', { virtuals: true });
UsersSchema.set('toJSON', { virtuals: true });

// Generate and hash reset password token
UsersSchema.methods.getResetPasswordToken = async function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	// Set the expire
	this.resetPasswordExpire = Date.now() + 2 * 60 * 60 * 1000;

	return resetToken;
};

// if phone number changes, reset the verification status
UsersSchema.pre('save', async function (next) {
	if (!this.isModified('phoneNumber')) next();

	this.phoneNumberVerified = false;
	this.phoneNumberVerificationToken = undefined;
	this.phoneNumberVerificationTokenExpires = undefined;
});

// if email changes, reset the verification status
UsersSchema.pre('save', async function (next) {
	if (!this.isModified('email')) next();

	this.emailVerified = false;
	this.emailVerificationToken = undefined;
	this.emailVerificationTokenExpires = undefined;
});

module.exports = mongoose.model('Users', UsersSchema);
