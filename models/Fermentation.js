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
			ref: 'User',
			required: true
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

fermentationSchema.pre('validate', async function validateAssignedDevice(next) {
	try {
		if (!this.assignedDevice) {
			this.assignedDevice = null;
			next();
		}
		const user = await User.findById(this.user).exec();
		if (await user.ownsDevice(this.assignedDevice)) {
			next();
		} else {
			throw new Error('Invalid device ID.');
		}
	} catch (error) {
		next(error);
	}
});

fermentationSchema.pre('save', async function removeFromDeviceDocument(next) {
	try {
		const oldFermentation = await Fermentation.findById(this._id).exec();
		if (oldFermentation && oldFermentation.assignedDevice !== this.assignedDevice) {
			await Device.findByIdAndUpdate(oldFermentation.assignedDevice?._id, {currentFermentation: null});
		}
		next();
	} catch (error) {
		console.error(`Error, could not remove fermentation from device document: ${error.message}`);
		next(error);
	}
});

fermentationSchema.pre('save', async function addToDeviceDocument(next) {
	if (!this.assignedDevice) return next();
	try {
		await Device.findByIdAndUpdate(this.assignedDevice, {currentFermentation: this._id}).exec();
		next();
	} catch (error) {
		console.error(`Error, could not add fermentation to device document: ${error.message}`);
		next(error);
	}
});

fermentationSchema.pre('save', async function addToUserDocument(next) {
	try {
		const user = await User.findById(this.user).populate('device').exec();
		if (user.fermentations.includes(this._id)) return next();
		user.fermentations.push(this._id);
		await user.save();
		next();
	} catch (error) {
		next(error);
	}
});

fermentationSchema.pre('save', async function createLinkedDataLog(next) {
	if (this.dataLog) return next();
	try {
		const dataLog = await DataLog.create({
			fermentation: this._id,
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

fermentationSchema.pre('findOneAndDelete', async function removeFromUserDocument(next) {
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

fermentationSchema.pre('findOneAndDelete', async function removeFromDeviceDocument(next) {
	// In pre('findOneAndDelete') 'this' refers to the query object rather than the document being updated.
	// https://mongoosejs.com/docs/middleware.html#notes
	try {
		const fermentation = await this.model.findOne(this.getQuery());
		const device = await Device.findById(fermentation.assignedDevice).exec();
		device.currentFermentation = null;
		await device.save();
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
