import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'Please provide a name!',
		trim: true
	},
	email: {
		type: String,
		required: 'Please provide a valid email address!',
		trim: true,
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Invalid email address.']
	},
	isAdmin: {
		type: Boolean,
		default: false,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	devices: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'device'
		}
	]
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	try {
		this.password = await bcrypt.hash(this.password, 12);
		next();
	} catch (error) {
		return next(err);
	}
});

userSchema.methods.isAuthenticated = async function isAuthenticated(password) {
	try {
		const resultBoolean = await bcrypt.compare(password, this.password);
		return resultBoolean;
	} catch (error) {
		return next(err);
	}
};

userSchema.methods.deviceNameIsUniqueToUser = async function (device) {
	console.log(`device passed to uniquecheck middleware: ${device}`);
	console.log(`user: ${this.name}`);
	console.log(`user's devices: ${this.devices}`);
	// if (!this.populated('devices.device')) {
	// 	console.log(`attempting to populate devices`);
	// 	await this.populate('devices.device').execPopulate();
	// }
	for (name of this.devices) {
		if (name == device.name) return false;
	}
	return true;
};

const User = mongoose.model('User', userSchema);

export default User;
