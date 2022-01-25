import bcrypt from 'bcrypt';
import User from '../../models/User.js';
import Util from '../../models/Util.js';
import * as sanitizeAndValidate from '../../utils/validation/index.js';
import {authenticateUserAndEstablishSession} from './logIn.js';

export const addUserToDatabase = async (req, res, next) => {
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

export const registrationForm = (req, res) => {
	res.render('user/register');
};

export const register = [
	sanitizeAndValidate.user, //
	addUserToDatabase,
	authenticateUserAndEstablishSession
];
