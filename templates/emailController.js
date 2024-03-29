const nodemailer = require('nodemailer');

const emailController = ({ options }) => {
	// create a transporter object to send email
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'kgosiepex@gmail.com',
			pass: '*O0D#5RQ152IDGua',
		},
	});

	// setup email data
	const mailOptions = {
		from: 'kgosiepex@gmail.com',
		to: 'kcncube@gmail.com',
		subject: 'Upcoming Bootcamps - Learn Node.js like a pro!',
		html: `
  <p>Hi [Subscriber],</p>
  <p>We are excited to announce that our company is holding a series of bootcamps focused on teaching Node.js. These bootcamps are designed for individuals who want to improve their skills and gain a deeper understanding of the Node.js ecosystem.</p>
  <p>The bootcamps will cover a variety of topics, including:</p>
  <ul>
    <li>An introduction to Node.js and its core concepts</li>
    <li>Building scalable and efficient web applications using Node.js</li>
    <li>Working with popular Node.js frameworks such as Express and Koa</li>
    <li>Building and consuming RESTful APIs</li>
    <li>Advanced topics such as testing, debugging, and performance optimization</li>
  </ul>
  <p>The bootcamps will be held on the following dates:</p>
  <ul>
    <li>Bootcamp 1: [Date and Time]</li>
    <li>Bootcamp 2: [Date and Time]</li>
      <li>Bootcamp 3: [Date and Time]</li>
  </ul>
  <p>Each bootcamp will be held online, and will consist of a series of lectures, hands-on exercises, and interactive discussions. Our experienced instructors will be on hand to provide guidance and support throughout the bootcamp.</p>
  <p>To reserve your spot, please visit our website <a href='[website link]'> [website link] </a> and sign up for the bootcamp(s) of your choice. Spaces are limited, so sign up now to avoid disappointment.</p>
  <p>If you have any questions or need more information, please don't hesitate to contact us at [email]</p>`,
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Email sent: %s', info.messageId);
	});
};

module.exports = emailController;
