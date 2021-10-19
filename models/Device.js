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
		assignedFermentation: {
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
		console.error(`Error, could not add device to user document: ${error.message}`);
		next(error);
	}
});

deviceSchema.pre('save', async function removeFromOldFermentationDocument(next) {
	try {
		const oldDevice = await Device.findById(this._id).exec();
		if (oldDevice && oldDevice.assignedFermentation != this.assignedFermentation) {
			await Fermentation.findByIdAndUpdate(oldDevice.assignedFermentation?._id, {assignedDevice: null});
		}
		next();
	} catch (error) {
		console.error(`Error, could not remove device from fermentation document: ${error.message}`);
		next(error);
	}
});

deviceSchema.pre('save', async function addToNewFermentationDocument(next) {
	if (!this.assignedFermentation) return next();
	try {
		await Fermentation.findByIdAndUpdate(this.assignedFermentation, {assignedDevice: this._id}).exec();
		next();
	} catch (error) {
		console.error(`Error, could not add device to fermentation document: ${error.message}`);
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
		console.error(`Error, could not remove device from user document: ${error.message}`);
	}
});

deviceSchema.pre('findOneAndDelete', async function removeFromFermentationDocument(next) {
	// In pre('findOneAndDelete') 'this' refers to the query object rather than the document being updated.
	// https://mongoosejs.com/docs/middleware.html#notes
	try {
		const device = await this.model.findOne(this.getQuery());
		// if (!device.assignedFermentation) return next();
		Fermentation.findByIdAndUpdate(device.assignedFermentation, {assignedDevice: null}).exec();
		next();
	} catch (error) {
		console.error(`Error, could not remove device from fermentation: ${error.message}`);
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
