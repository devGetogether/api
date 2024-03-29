const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
// var debug = require('debug')('server');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const http = require('http');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const connectDB = require('./config/db');
const errorhandler = require('./middleware/error');
const logger = require('./middleware/logger');

// Scheduled jobs files
// const checkPayment = require('./jobs/checkTimeRelatedIssues');

// Load env vars
dotenv.config({ path: './config/config.env' });

// console.log(`Open Ai Key: ${OPENAI_KEY}`);

// Connect to database
connectDB();

// Routes files
const auth = require('./routes/auth');
const users = require('./routes/user');
const quotations = require('./routes/quotations');
const institutions = require('./routes/institutions');
const appointments = require('./routes/appointments');
const notifications = require('./routes/notifications');
const bar = require('./routes/bar');
const caterer = require('./routes/caterer');
const decor = require('./routes/decor');
const entertainment = require('./routes/entertainment');
const eventPlanner = require('./routes/eventPlanner');
const florals = require('./routes/florals');
const mc = require('./routes/mc');
const makeup = require('./routes/makeUp');
const photographer = require('./routes/photographer');
const security = require('./routes/security');
const venue = require('./routes/venue');
const videographer = require('./routes/videographer');
const Cake = require('./routes/cake');
const Staff = require('./routes/Staff');
const Transport = require('./routes/Transport');
const Payment = require('./routes/payment');
const Review = require('./routes/Review');

const { checkPayment } = require('./jobs/checkTimeRelatedIssues');

const app = express();

// File upload
app.use(fileupload());

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// create a write stream (in append mode)
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
	flags: 'a',
});

// setup the logger
app.use(morgan('tiny', { stream: accessLogStream }));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());
// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// CORS error fixer
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// mount jobs
//checkPayment;

//Mount routers
app.use('/auth', auth);
app.use('/users', users);
app.use('/quotations', quotations);
app.use('/institutions', institutions);
app.use('/appointments', appointments);
app.use('/notifications', notifications);
app.get('/', (req, res) => {
	res.send({
		success: true,
		message: 'Tetogether API',
	});
});

app.use(errorhandler);

const PORT = process.env.PORT || 4444;

const server = app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`);
	// Close server & exit process
	server.close(() => process.exit(1));
});

// Handle not found endpoints
app.use((req, res, next) => {
	res.status(404).json({ error: 'Endpoint not found' });
});
