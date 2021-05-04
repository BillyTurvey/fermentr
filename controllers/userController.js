import User from '../models/User.js';
import {newToken, verifyToken} from '../utils/auth.js';

export const registrationForm = (req, res, next) => {
	res.render('user/register');
};

export const logInForm = (req, res, next) => {
	res.render('user/logIn');
};

export const logIn = async (req, res, next) => {
	//find user in db
	const user = await User.findOne({email: req.body.email}).exec();
	// check email and password
	if (!user || !user.isAuthenticated(req.body.password)) {
		req.flash('error', 'Invalid login credentials.');
		res.render('user/logIn', {
			title: 'Log In',
			email: req.body.email,
			flashes: req.flash()
		});
	}
	// give them a token
	const token = newToken(user);
	res.cookie('Bearer', token, {
		secure: true,
		httpOnly: true,
		sameSite: 'lax'
	});
	// redirect
};

export const register = async (req, res, next) => {
	try {
		const user = await User.create(req.body);
		req.flash('success', `${req.body.name}, your account was successfully created.`);
		req.flash('success', 'You are now logged in.');
		res.cookie('Bearer', newToken(user), {
			secure: true,
			httpOnly: true,
			sameSite: 'lax'
		});
		res.redirect('../..');
	} catch (error) {
		console.log(`Error during user registration: ${error.message}`);
		if (error.message.includes('E11000')) {
			error.message = 'Email already registered.';
		}
		req.flash('error', error.message);
		res.render('user/register', {
			title: 'Register',
			email: req.body.email,
			name: req.body.name,
			flashes: req.flash()
		});
	}
};
