import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import validator from 'validator';
import bcrypt from 'bcrypt';
import mongodbErrorHandler from 'mongoose-mongodb-errors';

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
	},
	password: {
		type: String,
		required: true
	}
});

userSchema.pre('save', function(next) {
	if (!this.isModified('password')) {
		return next();
	}

	bcrypt.hash(this.password, 12)
		.then(function(hashedPassword) {
			this.password = hashedPassword;
			next();
		})
		.catch(function(err) {
			return next(err);
		});
	});
	
	userSchema.methods.isAuthenticated = function(password) {
		bcrypt.compare(password, this.password)
			.then(function(authenticated) {
				return authenticated; 
			})
			.catch(function(err) {
				return next(err);
			});
};

userSchema.plugin(mongodbErrorHandler);

export const User = mongoose.model('User', userSchema)