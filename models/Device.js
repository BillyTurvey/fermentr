import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import User from './User.js';
import bcrypt from 'bcrypt';
import Fermentation from './Fermentation.js';

const deviceSchema = new mongoose.Schema(
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
		keyHash: String,
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		currentFermentation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Fermentation'
		}
	},
	{
		timestamps: true
	}
);

// Compound index ensures device name is unique to user
deviceSchema.index(
	{
		owner: 1,
		name: 1
	},
	{
		unique: true
	}
);

deviceSchema.pre('save', async function addDeviceToUserDocument(next) {
	try {
		const user = await User.findById(this.owner).populate('device').exec();
		if (user.devices.includes(this._id)) return next();
		user.devices.push(this._id);
		await user.save();
		next();
	} catch (error) {
		console.error(`Error during device registration: ${error.message}`);
		next(error);
	}
});

deviceSchema.pre('save', async function addToFermentationDocument(next) {
	try {
		if (!this.currentFermentation) return next();
		const fermentation = await Fermentation.findById(this.currentFermentation).exec();
		if (fermentation === null) {
			//for when a device is being updated during a fermentation pre save middleware during fermentation creation
			return next();
		}
		if (fermentation.assignedDevice == this._id) return next();
		fermentation.assignedDevice = this._id;
		await fermentation.save();
		next();
	} catch (error) {
		next(error);
	}
});

deviceSchema.pre('findOneAndDelete', async function removeFromUserDocument(next) {
	// In pre('findOneAndDelete') 'this' refers to the query object rather than the document being updated.
	// https://mongoosejs.com/docs/middleware.html#notes
	try {
		const device = await this.model.findOne(this.getQuery());
		const user = await User.findById(device.owner).populate('devices').exec();
		user.devices.pull(device._id);
		await user.save();
		next();
	} catch (error) {
		console.error(`Error during device deletion, could not remove device from user: ${error.message}`);
	}
});

deviceSchema.pre('findOneAndDelete', async function removeFromFermentationDocument(next) {
	// In pre('findOneAndDelete') 'this' refers to the query object rather than the document being updated.
	// https://mongoosejs.com/docs/middleware.html#notes
	try {
		const device = await this.model.findOne(this.getQuery());
		if (!device.currentFermentation) return next();
		const fermentation = await Fermentation.findById(device.currentFermentation).exec();
		fermentation.currentFermentation = null;
		await fermentation.save();
		next();
	} catch (error) {
		console.error(
			`Error during device deletion, could not remove device from fermentation: ${error.message}`
		);
	}
});

deviceSchema.methods.isAuthenticated = async function isAuthenticated(key) {
	try {
		const resultBoolean = await bcrypt.compare(key, this.keyHash);
		return resultBoolean;
	} catch (error) {
		console.error(error);
		return false;
	}
};

const Device = mongoose.model('Device', deviceSchema);

export default Device;
