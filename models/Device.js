import mongoose from 'mongoose';
import User from './User.js';
mongoose.Promise = global.Promise;

const deviceSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
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

// Need to add middleware to update users' 'devices' array when a new device is created or deleted
// deviceSchema.post('save', function (device, next) {
// 	User.findById('device.owner.id').devices.push(device).exec();
// });

const Device = mongoose.model('Device', deviceSchema);

export default Device;
