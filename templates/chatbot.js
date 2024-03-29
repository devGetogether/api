const express = require('express');
const bodyParser = require('body-parser');
const Twilio = require('twilio');

// Twilio account information
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const client = new Twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/whatsapp', (req, res) => {
	const { Body, From } = req.body;
	// Handle incoming message
	handleMessage(Body, From);
	res.send('Message received');
});

function handleMessage(message, sender) {
	// Write your chatbot logic here
	if (message.toLowerCase().includes('hi')) {
		sendMessage(sender, 'Hello! How can I help you?');
	} else if (message.toLowerCase().includes('help')) {
		sendMessage(sender, 'I can help you with information. What do you need?');
	} else {
		sendMessage(sender, 'I am sorry, I do not understand your request');
	}
}

function sendMessage(to, body) {
	client.messages
		.create({
			body: body,
			from: 'whatsapp:+14155238886',
			to: `whatsapp:${to}`,
		})
		.then((message) => console.log(message.sid))
		.catch((err) => console.log(err));
}
