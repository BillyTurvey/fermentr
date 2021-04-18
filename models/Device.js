import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const deviceSchema = new mongoose.Schema({
	deviceID: {
		type: String,
		required: true
	},
	name: {
		type: String,
		trim: true,
	},
	tokenHash: String,
	owner: {
		type: String,
		trim: true,
	},
	dateRegistered: Number
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;