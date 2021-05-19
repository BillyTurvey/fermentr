import mongoose from 'mongoose';
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

const Device = mongoose.model('Device', deviceSchema);

export default Device;
