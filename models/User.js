import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import Device from './Device.js';
import Fermentation from './Fermentation.js';

const userSchema = new mongoose.Schema(
	{
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
				ref: 'Device'
			}
		],
		fermentations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Fermentation'
			}
		]
	},
	{
		timestamps: true
	}
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	try {
		this.password = await bcrypt.hash(this.password, 12);
		next();
	} catch (error) {
		return next(err);
	}
});

userSchema.pre('findOneAndDelete', async function deleteFermentationsAndDevices(next) {
	try {
		const user = await this.model.findOne(this.getQuery());
		user.fermentations.forEach(async fermentation => {
			await Fermentation.findByIdAndDelete(fermentation._id).exec(); //TESTTHIS
		});
		user.devices.forEach(async device => {
			await Device.findByIdAndDelete(device._id).exec(); //TESTTHIS
		});
		next();
	} catch (error) {
		console.error(`Error during device deletion, could not remove device from user: ${error.message}`);
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

userSchema.methods.ownsDevice = async function ownsDevice(deviceID) {
	for (const device in this.devices) {
		if (this.devices[device]._id.toString() == deviceID.toString()) {
			return true;
		}
	}
	return false;
};

userSchema.methods.ownsFermentation = async function ownsFermentation(fermentationID) {
	for (const fermentation in this.fermentations) {
		if (this.fermentations[fermentation].id === fermentationID) {
			return true;
		}
	}
	return false;
};

const User = mongoose.model('User', userSchema);

export default User;
