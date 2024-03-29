const path = require('path');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

const sendEmail = async (options) => {
	let transporter = nodemailer.createTransport({
		host: process.env.SENDGRID_SERVER,
		port: process.env.SENDGRID_PORT,
		auth: {
			user: process.env.SENDGRID_USERNAME,
			pass: process.env.SENDGRID_API_KEY,
		},
	});

	const handlebarOptions = {
		viewEngine: {
			extName: '.handlebars',
			partialsDir: path.resolve('./templates'),
			defaultLayout: false,
		},
		viewPath: path.resolve('./templates'),
		extName: '.handlebars',
	};

	transporter.use('compile', hbs(handlebarOptions));

	console.log(options);

	var message = {
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
		to: `${options.user_email}`,
		subject: options.subject,
		template: `${options.emailType}`,
		context: {
			name: options.user_name,
			resetLink: options.resetLink,
			accountStatus: options.accountStatus,
			message: options.message,
			code: options.code,
			expiry: options.expiresIn,
			doctor: options.doctor_name,
		},
	};

	// send mail with defined transport object
	// let message = {
	// 	from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
	// 	to: options.email,
	// 	subject: options.subject,
	// 	text: options.message,
	// };

	await transporter.sendMail(message).then((response) => {
		// if (error) console.log(error);

		console.log(response);
	});

	// console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
