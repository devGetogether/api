const sgMail = require('@sendgrid/mail');
const debug = require('debug')(':SendGrid');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const nodemailer = require('nodemailer');

const sgMailer = async () => {
	const msg = {
		to: 'kcncube@gmail.com',
		from: 'stemskillfactory@gmail.com',
		subject: 'Sending with SendGrid is Fun',
		text: 'and easy to do anywhere, even with Node.js',
		html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	};

	sgMail
		.send(msg)
		.then((response) => {
			debug('Email sent');
			debug(response);
		})
		.catch((error) => {
			console.error(error);
		});

	// const info = await transporter
	// 	.sendMail(msg)
	// 	.then((response) => {
	// 		debug(response);
	// 	})
	// 	.catch((error) => {
	// 		console.error(error);
	// 		// console.error(error.response.body);
	// 	});

	// debug('Message sent: %s', info);
};

module.exports = sgMailer;
