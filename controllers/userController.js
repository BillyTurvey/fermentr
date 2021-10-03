import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Util from '../models/Util.js';

export const registrationForm = (req, res) => {
	res.render('user/register');
};

export const logInForm = (req, res) => {
	res.render('user/logIn');
};

export const dashboard = async (req, res) => {
	console.log(`🟣 Dashboard requested ${Date.now()}`);
	if (req.user) {
		return res.render('user/dashboard', {
			title: 'Dashboard',
			fermentations: req.user.fermentations || [],
			devices: req.user.devices || []
		});
	}
	res.status(401).end();
};

export const logIn = (req, res, next) => {
	console.log(`=====================================================================`);
	console.log(`🟣 logIn controller function called ${Date.now()}`);
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			req.flash('error', 'Login failed.');
			return res.render('user/logIn', {title: 'Log In', email: req.body.email, flashes: req.flash()});
		}
		console.log(`🟠 User has been authenticated, about to call req.logIn() ${Date.now()}`);
		req.logIn(user, async function (err) {
			if (err) return next(err);
			req.flash('success', 'Login successful.');
			console.log(`🔵 about to redirect to dashboard`);
			res.redirect('/user/dashboard');
		});
	})(req, res, next);
};

export const logOut = (req, res) => {
	req.logout();
	req.flash('success', 'You have successfully logged out.');
	res.redirect('/');
};

export const register = async (req, res, next) => {
	try {
		const registrationPassword = await Util.findById('6154725802b5519bf4772293').exec();
		const isAuthorisedToRegister = await bcrypt.compare(
			req.body.registrationPassword,
			registrationPassword.value
		);
		if (isAuthorisedToRegister == false) throw new Error('Invalid registration password.');

		await User.create(req.body);
		req.flash('success', `${req.body.name}, your account was successfully created.`);
		next();
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

export const account = (req, res) => {
	res.render('user/account');
};

export const confirmDelete = (req, res) => {
	res.render('user/confirmDelete');
};

export const updateAccount = (req, res) => {};

export const deleteAccount = async (req, res, next) => {
	// pre delete hook on the user model deletes the user's devices and fermentations.
	try {
		if (req.user) {
			await User.findByIdAndDelete(req.user._id).exec();
			req.flash('success', `User: ${req.user.name} was successfully deleted.`);
			res.redirect('/');
		} else {
			res.status(401).end();
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
};
