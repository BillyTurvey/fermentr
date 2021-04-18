import User from '../models/User.js'
import {promisify} from 'util';

const renderRegistrationForm = (req, res) => {
	res.render('register', { title: 'Register' });
};

const register = async (req, res, next) => {
	const newUser = new User({
		email: req.body.email,
		name: req.body.name
	});
	const registerUser = promisify(User.register).bind(User);
	registerUser(newUser, req.body.password)
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
					name: req.body.fullName, 
					flashes: req.flash(),
				});
		});
};

const registrationForm = (req, res, next) => {
	res.render('user/register');
};

export { registrationForm, register};