import mongoose from 'mongoose';
import User from './User.js';
mongoose.Promise = global.Promise;

const deviceSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	description: {
		type: String,
		trim: true
	},
	tokenHash: String,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	currentFermentation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	dateRegistered: Number
});

deviceSchema.index(
	{
		owner: 1,
		name: 1
	},
	{
		unique: true
	}
);

deviceSchema.pre('save', async function (next) {
	console.log(`🔵 device.owner: ${this.owner}`);
	try {
		const user = await User.findById(this.owner).exec();
		// const user = await User.findById(this.owner).populate('devices').exec();
		console.log(`🔵 user found: ${user.name}`);
		console.log(`🔵 user's devices: ${user.devices}`);
		console.log(`🔵 POPULATED: ${user.populated('devices.device')}`);
		if (user.deviceNameIsUniqueToUser(this)) {
			user.devices.push(this._id);
			await user.save();
			next();
		} else {
			const err = new Error('Device name already in use.');
			next(err);
		}
	} catch (error) {
		const err = new Error('Could not find user to check if device name already in use.');
		next(err);
	}
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;
