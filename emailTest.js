// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
// console.log(process.env.SENDGRID_API_KEY);
sgMail.setApiKey('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');
const msg = {
	to: 'kcncube@gmail.com', // Change to your recipient
	from: 'gettogether.dev@gmail.com', // Change to your verified sender
	subject: 'Sending with SendGrid is Fun',
	text: 'and easy to do anywhere, even with Node.js',
	html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail
	.send(msg)
	.then(() => {
		console.log('Email sent');
	})
	.catch((error) => {
		console.error(error.response.body);
	});
