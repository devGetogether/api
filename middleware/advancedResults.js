const advancedResults =
	(model, populate, passedSelect, uniqueQuery) => async (req, res, next) => {
		let query;

		console.log(req.query);

		// Duplicate Query
		const reqQuery = { ...req.query };

		// Fields to remove from Query
		let removeFields = ['select', 'sort', 'page', 'limit', 'search'];

		//Remove Fields
		removeFields.forEach((param) => delete reqQuery[param]);

		// Stringify Query
		let queryStr = JSON.stringify(reqQuery);

		// Fix fields for compare
		queryStr = queryStr.replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			(match) => `$${match}`
		);

		console.log(`Query String: ${queryStr}`);

		// Attach Specific Queries
		if (uniqueQuery) query = model.find(uniqueQuery).find(JSON.parse(queryStr));
		// Set the query object
		else query = model.find(JSON.parse(queryStr));

		// Handle Search
		if (req.query.search)
			query = model
				.find({ name: new RegExp(req.query.search, 'i') })
				.find(JSON.parse(queryStr));

		// Fields to select
		if (req.query.select) {
			const fields = req.query.select.split(',').join(' ');
			query = query.select(fields);
		}

		// Fields to select from attached Advance Results select
		if (passedSelect) {
			const fields = passedSelect;
			query = query.select(fields);
			console.log(`Query String : ${query.select()}`);
		}

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query.sort('name');
		}

		// Executing Query
		if (populate) {
			query = query.populate(populate);
		}

		// Pagination
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const documents = await query;
		const totalDocuments = documents.length;

		console.log(`Total Documents: ${totalDocuments}`.green);
		query = query.skip(startIndex).limit(limit);
		const results = await query;
		// console.log(results);

		const totalPages = Math.ceil(totalDocuments / limit);
		// Pagination result
		let pagination = {};

		if (endIndex < totalDocuments) {
			pagination.next = {
				page: page + 1,
				limit,
			};
		} else {
			pagination.next = {
				page,
				limit,
			};
		}

		pagination.currentpage = page;

		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			};
		} else {
			pagination.prev = {
				page,
				limit,
			};
		}

		pagination.totalPages = totalPages;

		res.advancedResults = {
			success: true,
			count: results.length,
			listLength: totalDocuments,
			pagination,
			data: results,
		};

		next();
	};

module.exports = advancedResults;
