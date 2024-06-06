const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const debug = require('debug')('server:db');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const User = require('./models/User');
const AV = require('./models/AV');
const Bar = require('./models/Bar');
const Cake = require('./models/Cake');
const Caterer = require('./models/Caterer');
const Decor = require('./models/Decor');
const DJ = require('./models/DJ');
const Entertainment = require('./models/Entertainment');
const Equipment = require('./models/Equipment');
const EventPlanner = require('./models/EventPlanner');
const Floral = require('./models/Florals');
const Makeup = require('./models/MakeUp');
const MC = require('./models/MC');
const Photographer = require('./models/Photographer');
const Security = require('./models/Security');
const Staff = require('./models/Staff');
const Transport = require('./models/Transport');
const Venue = require('./models/Venue');
const Videographer = require('./models/Videographer');

console.log('Connecting to DB...'.green.inverse);
// Connect to DB
const connectDB = async () => {
	const conn = await mongoose.connect(process.env.MONGODB_DEV_LOCAL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});

	console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

connectDB();

// Read JSON files
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));
const av = JSON.parse(fs.readFileSync(`${__dirname}/data/av.json`, 'utf-8'));
const bar = JSON.parse(fs.readFileSync(`${__dirname}/data/bar.json`, 'utf-8'));
const cake = JSON.parse(fs.readFileSync(`${__dirname}/data/cake.json`, 'utf-8'));
const caterer = JSON.parse(fs.readFileSync(`${__dirname}/data/caterer.json`, 'utf-8'));
const decor = JSON.parse(fs.readFileSync(`${__dirname}/data/decor.json`, 'utf-8'));
const dj = JSON.parse(fs.readFileSync(`${__dirname}/data/dj.json`, 'utf-8'));
const entertainment = JSON.parse(fs.readFileSync(`${__dirname}/data/entertainment.json`, 'utf-8'));
const equipment = JSON.parse(fs.readFileSync(`${__dirname}/data/equipment.json`, 'utf-8'));
const eventPlanner = JSON.parse(fs.readFileSync(`${__dirname}/data/eventPlanner.json`, 'utf-8'));
const floral = JSON.parse(fs.readFileSync(`${__dirname}/data/florals.json`, 'utf-8'));
const makeup = JSON.parse(fs.readFileSync(`${__dirname}/data/makeup.json`, 'utf-8'));
const mc = JSON.parse(fs.readFileSync(`${__dirname}/data/mc.json`, 'utf-8'));
const photographer = JSON.parse(fs.readFileSync(`${__dirname}/data/photographer.json`, 'utf-8'));
const security = JSON.parse(fs.readFileSync(`${__dirname}/data/security.json`, 'utf-8'));
const staff = JSON.parse(fs.readFileSync(`${__dirname}/data/staff.json`, 'utf-8'));
const transport = JSON.parse(fs.readFileSync(`${__dirname}/data/transport.json`, 'utf-8'));
const venue = JSON.parse(fs.readFileSync(`${__dirname}/data/venue.json`, 'utf-8'));
const videographer = JSON.parse(fs.readFileSync(`${__dirname}/data/videographer.json`, 'utf-8'));

// Import into DB
const importData = async () => {
	console.log('Importing data...'.green.inverse);
	// try {
	// 	await User.create(users);

	// 	console.log('Data Imported...'.green.inverse);
	// 	process.exit();
	// } catch (err) {
	// 	console.log(err);
	// 	process.exit(1);
	// }

	try {
		await Videographer.create(videographer);

		await videographer.forEach(async (item) => {
			console.log('Updating...'.yellow.inverse, item.userID);

			try {
				let user = await User.findById(item.userID);

				let userRoles = [...user.role, 'videographer'];

				await User.findByIdAndUpdate(item.userID, { role: userRoles });
			} catch (error) {
				console.log(error);
			}
		});

		console.log('Data Imported...'.green.inverse);
		// process.exit();
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await User.deleteMany();

		debug('Data Destroyed...'.red.inverse);
		process.exit();
	} catch (err) {
		debug(err);
	}
};

// const update = async (prod) => {
// 	console.log('Updating...'.green.inverse, prod.productCode);
// 	const prdct = await Product.findOne({ productCode: prod.productCode });

// 	console.log('Product: ', prdct);

// 	if (prdct) {
// 		await Product.updateOne(
// 			{ productCode: prod.productCode },
// 			{ $set: { price: prod.price } }
// 		);
// 	} // if not found, add to array of missing products
// 	else {
// 		const newList = [...msssngPrdcts, prod.productCode];
// 		msssngPrdcts = newList;
// 	}
// };

// // Change prices
// const changePrices = async () => {
// 	console.log('Changing Prices...'.green.inverse);
// 	const msssngPrdcts = [];
// 	// try {
// 	// find products by product code from the prices.json file and update the price
// 	await prices.forEach((prod) => {
// 		update(prod);
// 	});
// 	console.log('Data Imported...'.green.inverse);

// 	// print out the missing products
// 	console.log('Missing Products: ', msssngPrdcts);

// 	process.exit();
// 	// } catch (err) {
// 	// 	console.log(err);
// 	// 	process.exit(1);
// 	// }
// };

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
