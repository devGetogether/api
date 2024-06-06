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
				'equipment_service_provider',
				'transportation_service_provider',
				'catering_service_provider',
				'security_service_provider',
				'makeup_and_hair_service_provider',
				'dj',
				'audio_visual_service_provider',
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
		email: {
			type: String,
			unique: true,
		},
		emailVerified: {
			type: Boolean,
			default: true,
		},
		verificationToken: { type: String, default: null },
		verificationTokenExpires: { type: Date },
		password: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		active: { type: Boolean, default: true },
		// fullPermissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctors' }],
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
);

// if its a new user, generate an email verification token
UsersSchema.methods.verifyEmail = async function () {
	this.verificationToken = Math.floor(100000 + Math.random() * 900000);
	this.verificationTokenExpires = Date.now() + 5 * 60 * 60 * 1000;
};

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

// if email changes, reset the verification status
UsersSchema.pre('save', async function (next) {
	if (!this.isModified('email')) next();

	this.emailVerified = false;
});

module.exports = mongoose.model('Users', UsersSchema);
