import passport from 'passport';
import User from '../models/User.js';

export const registrationForm = (req, res) => {
	res.render('user/register');
};

export const logInForm = (req, res) => {
	res.render('user/logIn');
};

export const dashboard = (req, res) => {
	res.render('user/dashboard');
};

export const logIn = (req, res, next) => {
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			req.flash('error', 'Login failed.');
			return res.render('user/logIn', {title: 'Log In', email: req.body.email, flashes: req.flash()});
		}
		req.logIn(user, async function (err) {
			if (err) return next(err);
			req.flash('success', 'Login successful.');
			res.redirect('/user/dashboard');
		});
	})(req, res, next);
};

export const logOut = (req, res) => {
	req.logout();
	req.flash('success', 'You have successfully logged out.');
	res.redirect('/');
};

export const register = async (req, res) => {
	try {
		const user = await User.create(req.body);
		req.flash('success', `${req.body.name}, your account was successfully created.`);
		req.flash('success', 'You are now logged in.');
		res.redirect('/');
	} catch (error) {
		console.error(`Error during user registration: ${error.message}`);
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
