import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import User from './User.js';
import bcrypt from 'bcrypt';

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

deviceSchema.pre('save', async function saveDeviceToUser(next) {
	try {
		console.log(`🔴 In pre save hook`);
		const user = await User.findById(this.owner).populate('device').exec();
		console.log(`🔴 user: ${user}`);
		if (user.devices.includes(this._id)) next();
		user.devices.push(this._id);
		await user.save();
		next();
	} catch (error) {
		console.error(`Error during device registration: ${error.message}`);
		next(error);
	}
});

deviceSchema.pre('findOneAndDelete', async function removeFromUser(next) {
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
