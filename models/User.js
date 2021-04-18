import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import validator from 'validator';
import mongodbErrorHandler from 'mongoose-mongodb-errors';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'Please provide a name!', 
		trim: true,
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
	}
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

const User = mongoose.model('User', userSchema)

export default User;