import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const fermentationSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	description: {
		type: String,
		trim: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	recipe: {
		malt: String,
		hops: String,
		yeast: String
	},
	gravity: {
		targetOG: Number,
		actualOG: Number,
		targetFG: Number,
		actualFG: Number
	},
	startTime: Number,
	dateRegistered: Number,
	temperature: {
		target: [
			{
				time: Number, //minutes since pitching
				temp: Number //degrees C
			}
		],
		actual: [
			{
				time: Number,
				temp: Number
			}
		]
	},
	co2Activity: [
		{
			time: Number,
			value: Number //bubbles per minutef
		}
	],
	notes: [
		{
			time: Number,
			note: String
		}
	]
});

// Compound index ensures fermentation name is unique to user
fermentationSchema.index(
	{
		user: 1,
		name: 1
	},
	{
		unique: true
	}
);

fermentationSchema.pre('save', async function (next) {
	try {
		const user = await User.findById(this.owner).populate('device').exec();
		if (user.fermentationNameIsUniqueToUser(this)) {
			user.fermentations.push(this._id);
			await user.save();
			next();
		} else {
			const err = new Error(`Fermentation name already in use.`);
			next(err);
		}
	} catch (error) {
		next(error);
	}
});

const Fermentation = mongoose.model('Fermentation', fermentationSchema);

export default Fermentation;
