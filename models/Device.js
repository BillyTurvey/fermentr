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
			ref: 'user'
		},
		currentFermentation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'fermentation'
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

deviceSchema.pre('save', async function saveDeviceToUserIfDeviceNameIsUniqueToUser(next) {
	try {
		const user = await User.findById(this.owner).populate('device').exec();
		if (user.devices.includes(this._id)) next();
		user.devices.push(this._id);
		await user.save();
		next();
	} catch (error) {
		console.error(`Error during ${error.message}`);
		next(error);
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
