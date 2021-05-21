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

//Need to add middleware to update users' 'devices' array when a new device is created or deleted
deviceSchema.post('save', async function (device, next) {
	console.log(`in device post save middleware`);
	console.log(`device: ${device}`);
	console.log(`user: ${device.owner}`);
	const user = await User.findById(device.owner);
	console.log(`user having device added: ${user.name}`);
	user.devices.push(device.id);
	await user.save();
	next();
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;
