import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import validator from 'validator';
import bcrypt from 'bcrypt';

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

userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next();

	try {
		this.password = await bcrypt.hash(this.password, 12);
		next();
	} catch (error) {
		return next(err);
	}
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

const User = mongoose.model('User', userSchema)

export default User;