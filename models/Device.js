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
	keyHash: String,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	currentFermentation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'fermentation'
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
	try {
		const user = await User.findById(this.owner).populate('device').exec();
		if (user.deviceNameIsUniqueToUser(this)) {
			user.devices.push(this._id);
			await user.save();
			next();
		} else {
			const err = new Error(`Device name already in use.`);
			next(err);
		}
	} catch (error) {
		const err = new Error('Could not check if device name already in use.');
		next(err);
	}
});

deviceSchema.methods.isAuthenticated = async function isAuthenticated(key) {
	try {
		const resultBoolean = await bcrypt.compare(key, this.keyHash);
		return resultBoolean;
	} catch (error) {
		return next(err);
	}
};

const Device = mongoose.model('Device', deviceSchema);

export default Device;
