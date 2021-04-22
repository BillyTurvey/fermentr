import User from '../models/User.js'
import {promisify} from 'util';

export const registrationForm = (req, res, next) => {
	res.render('user/register');
};

export const register = async (req, res, next) => {
	//validate/sanitise TODO
	User.create(req.body)
		.then( () => {
			req.flash('success', `${req.body.name}, your account was successfully created.`);
			res.redirect('/');
		})
		.catch(error => {
				console.log(`Error during user registration:`);
				console.log(error);
				if (error.name == 'UserExistsError') {
					error.message = 'Email already registered.';
				};
				req.flash('error', error.message);
				res.render('user/register', {
					title: 'Register', 
					email: req.body.email,
					name: req.body.name, 
					flashes: req.flash(),
				});
		});
};

export const logIn = async (req, res, next) => {
	await User.findOne()
}