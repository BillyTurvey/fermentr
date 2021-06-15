import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import User from './User.js';

const fermentationSchema = new mongoose.Schema(
	{
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
			ref: 'User'
		},
		assignedDevice: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Device'
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
				value: Number //bubbles per minute
			}
		],
		notes: [
			{
				time: Number,
				note: String
			}
		]
	},
	{
		timestamps: true
	}
);

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

fermentationSchema.pre('save', async function linkFermentationToUserAndDevice(next) {
	try {
		const user = await User.findById(this.user).populate('device').exec();
		user.fermentations.push(this._id);
		await user.save();
		next();
	} catch (error) {
		next(error);
	}
});

const Fermentation = mongoose.model('Fermentation', fermentationSchema);

export default Fermentation;
