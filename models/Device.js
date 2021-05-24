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

deviceSchema.pre('save', async function (device, next) {
	const user = await User.findById(device.owner);
	if (user.deviceNameIsUniqueToUser(device)) {
		user.devices.push(device.id);
		await user.save();
		next();
	} else {
		const err = new Error('Device name already in use.');
		next(err);
	}

	// function deviceNameIsUniqueToUser(device, user) {
	// 	for (name of user.devices) {
	// 		if (name == device.name) return false;
	// 	}
	// 	return true;
	// }
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;
