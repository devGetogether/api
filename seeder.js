const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const debug = require('debug')('server:db');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Institutions = require('./models/Institutions');

console.log('Connecting to DB...'.green.inverse);
// Connect to DB
mongoose.connect(process.env.MONGODB_DEV_LOCAL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

// debug(`MongoDB Connected: ${conn.connection.host}`.green.bold);

// Read JSON files
const institutions = JSON.parse(
	fs.readFileSync(`${__dirname}/data/institutions.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
	console.log('Importing data...'.green.inverse);
	try {
		await Institutions.create(institutions);

		console.log('Data Imported...'.green.inverse);
		process.exit();
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await Institutions.deleteMany();

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
