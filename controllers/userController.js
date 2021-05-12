import passport from 'passport';
import User from '../models/User.js';
import {newToken, verifyToken} from '../utils/auth.js';

export const registrationForm = (req, res, next) => {
	res.render('user/register');
};

export const logInForm = (req, res, next) => {
	res.render('user/logIn');
};

export const logIn = (req, res) => {
	console.log(`BANANAS, time: ${Date.now()}`);
	passport.authenticate('local', function (err, user, info) {
		console.log(`ORANGES, time: ${Date.now()}`);
		console.log(`user: ${user}`);
		if (err) {
			console.log(`MANGO`);
			return next(err);
		}
		if (!user) {
			console.log(`MELON`);
			console.log('error:', err);
			console.log('info:', info);
			req.flash('error', 'Login failed.');
			return res.render('user/logIn', {title: 'Log In', email: req.body.email, flashes: req.flash()}); //try render here try returning render
		}
		req.logIn(user, function (err) {
			console.log(`APPLES, time: ${Date.now()}`);
			if (err) return next(err);
			req.flash('success', 'Login successful.');
			if (req.headers.referer === '/login') return res.redirect('/');
			return res.redirect(req.headers.referer || '/');
		});
	})(req, res);
};

export const logOut = (req, res) => {
	req.logout();
	res.redirect(req.headers.referer || '/');
};

export const register = async (req, res) => {
	try {
		const user = await User.create(req.body);
		req.flash('success', `${req.body.name}, your account was successfully created.`);
		req.flash('success', 'You are now logged in.');
		res.redirect('/');
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
