const morgan = require('morgan');

// @desc    Logs request to console
const logger = (req, res, next) => {
	morgan('dev');

	next();
};

module.exports = logger;

// const assignId = (req, res, next) => {
// 	req.id = uuidv4;
// 	next();
// };

// app.use(assignId);

// morgan.token('id', function getId(req) {
// 	return req.id;
// });

// app.use(morgan(':method :status :url "HTTP/:http-version"'));
// app.use(logger);

// let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
// 	flags: 'a',
// });
// app.use(
// 	morgan(':id :method :status :url "HTTP/:http-version"', {
// 		stream: accessLogStream,
// 	})
// );
