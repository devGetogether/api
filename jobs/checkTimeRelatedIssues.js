const cron = require('node-cron');
const Users = require('../models/User');
const debug = require('debug')('checkPayments');
const moment = require('moment');

cron.schedule(' */1 * * * *', async function (req, res, next) {
	let today_date = moment(new Date()).valueOf();

	// check account membership status
	const accounts = await Users.find();

	// if (accounts) {
	// 	accounts.forEach(async (account) => {
	// 		//format user membership expiry date to same format as today date then compare

	// 		let userDueDate = moment(account.membershipStatus.expires).valueOf();
	// 		if (account.membershipStatus.active)
	// 			if (today_date >= userDueDate) {
	// 				const modAccount = await Users.findByIdAndUpdate(account._id, {
	// 					membershipStatus: {
	// 						active: false,
	// 						expires: account.membershipStatus.expires,
	// 					},
	// 				});
	// 			}
	// 	});
	// }

	// // check bootcamp start date passing
	// const bootcamps = await Bootcamps.find();

	// if (bootcamps) {
	// 	bootcamps.forEach(async (bootcamp) => {
	// 		//format bootcamp start date to same format as today date then compare

	// 		let bootcampStartDate = new Date(`${bootcamp.dateStart} ${bootcamp.timeStart}`);

	// 		bootcampStartDate = moment(bootcampStartDate).valueOf();

	// 		if (today_date >= bootcampStartDate) {
	// 			const modBootcamp = await Bootcamps.findByIdAndUpdate(bootcamp._id, {
	// 				bootcampPassed: true,
	// 			});
	// 		} else {
	// 			const modBootcamp = await Bootcamps.findByIdAndUpdate(bootcamp._id, {
	// 				bootcampPassed: false,
	// 			});
	// 		}
	// 	});
	// }
});
