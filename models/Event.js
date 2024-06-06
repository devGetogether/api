const { startCase, values } = require('lodash');
const mongoose = require('mongoose');
const Cake = require('./Cake');
const EventPlanner = require('./EventPlanner');
const AV = require('./AV');
const Bar = require('./Bar');
const Caterer = require('./Caterer');
const Decor = require('./Decor');
const DJ = require('./DJ');
const Entertainment = require('./Entertainment');
const Equipment = require('./Equipment');
const Floral = require('./Florals');
const MakeUp = require('./MakeUp');
const MC = require('./MC');
const Photographer = require('./Photographer');
const Security = require('./Security');
const Staff = require('./Staff');
const Transport = require('./Transport');
const Venue = require('./Venue');
const Videographer = require('./Videographer');

const eventSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		details: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		duration: {
			value: {
				type: Number,
				required: true,
			},
			unit: {
				type: String,
				required: true,
			},
		},
		location: {
			type: String,
			required: true,
		},
		maxAttendees: {
			type: Number,
			required: true,
		},
		organizer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		category: {
			type: String, // E.g., 'Wedding', 'Conference', 'Party'
			required: true,
		},
		styleLink: {
			type: String,
		},
		images: [String], // Array of image URLs
		tags: [String], // Array of keywords
		status: {
			type: String,
			enum: ['Upcoming', 'Ongoing', 'Completed'],
			default: 'Upcoming',
		},
		vendors: {
			av: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'AV',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			bar: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Bar',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			cake: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Cake',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			caterer: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Caterer',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			decor: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Decor',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			dj: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'DJ',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			entertainment: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Entertainment',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			equipment: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Equipment',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			eventplanner: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'EventPlanner',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			floral: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Floral',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			makeup: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'MakeUp',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			mc: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'MC',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			photographer: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Photographer',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			security: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Security',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			staff: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Staff',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			transport: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Transport',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			venue: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Venue',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
			videographer: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Videographer',
				},
				cost: {
					type: Number,
					default: 0,
				},
				paid: { type: Boolean, default: false },
			},
		},
	},
	{ timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
