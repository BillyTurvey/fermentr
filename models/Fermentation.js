import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import User from './User.js';
import Device from './Device.js';
import DataLog from './DataLog.js';

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
		targetOG: Number,
		actualOG: Number,
		targetFG: Number,
		actualFG: Number,
		startTime: Number,
		dataLog: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'DataLog'
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

fermentationSchema.pre('validate', async function createLinkedDataLog(next) {
	console.log(`🔴 in prevalidate hook`);
	if (this.dataLog) return next();
	try {
		console.log(`🟣 CREATING A LINKED DATALOG`);
		const dataLog = await DataLog.create({
			thermalProfile: {
				target: [],
				actual: []
			},
			co2Activity: []
		});
		this.dataLog = dataLog._id;
		next();
	} catch (error) {
		next(error);
	}
});

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

fermentationSchema.pre('findOneAndDelete', async function removeFromUser(next) {
	// In pre('findOneAndDelete') 'this' refers to the query object rather than the document being updated.
	// https://mongoosejs.com/docs/middleware.html#notes
	try {
		const fermentation = await this.model.findOne(this.getQuery());
		const user = await User.findById(fermentation.user).exec();
		user.fermentations.pull(fermentation._id);
		await user.save();
		next();
	} catch (error) {
		console.error(
			`Error during fermentation deletion, could not remove fermentation from user: ${error.message}`
		);
	}
});

fermentationSchema.pre('findOneAndDelete', async function removeFromDevice(next) {
	// In pre('findOneAndDelete') 'this' refers to the query object rather than the document being updated.
	// https://mongoosejs.com/docs/middleware.html#notes
	try {
		const fermentation = await this.model.findOne(this.getQuery());
		await Device.findByIdAndUpdate(
			fermentation.assignedDevice,
			{assignedDevice: undefined},
			{omitUndefined: true}
		).exec();
		next();
	} catch (error) {
		console.error(
			`Error during fermentation deletion, could not remove fermentation from device: ${error.message}`
		);
	}
});

fermentationSchema.pre('findOneAndDelete', async function deleteDataLog(next) {
	// In pre('findOneAndDelete') 'this' refers to the query object rather than the document being updated.
	// https://mongoosejs.com/docs/middleware.html#notes
	try {
		const fermentation = await this.model.findOne(this.getQuery());
		await DataLog.findByIdAndDelete(fermentation.dataLog).exec();
		next();
	} catch (error) {
		console.error(
			`Error during fermentation deletion, could not delete associate data log: ${error.message}`
		);
	}
});

const Fermentation = mongoose.model('Fermentation', fermentationSchema);

export default Fermentation;
