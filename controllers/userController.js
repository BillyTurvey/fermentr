import mongoose from 'mongoose';
import User from '../models/User.js'
import {promisify} from 'util';

const renderRegistrationForm = (req, res) => {
	res.render('register', { title: 'Register' });
};

const registerUser = async (req, res, next) => {  
	const newUser = new User({
		email: req.body.email,
		name: req.body.fullName
	});
	const registerUser = promisify(User.register).bind(User);
	registerUser(newUser, req.body.password)
		.then( () => {
			req.flash('success', `${req.body.fullName}, your account was successfully created.`);
			next();
		})
		.catch(error => {
				console.log(`Error during user registration:`);
				console.log(error);
				if (error.name == 'UserExistsError') {
					error.message = 'Email already registered.';
				};
				req.flash('error', error.message);
				res.render('register', {
					title: 'Register', 
					email: req.body.email,
					fullName: req.body.fullName, 
					shortName: req.body.shortName, 
					flashes: req.flash(),
				});
		});
};

const registrationForm = (req, res, next) => {
	res.render('user/register');
};

export { registrationForm, registerUser };