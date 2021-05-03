import User from '../models/User.js';
import {body, param, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import {newToken, verifyToken} from '../utils/auth.js';

export const registrationForm = (req, res, next) => {
	res.render('user/register');
};

export const logInForm = (req, res, next) => {
	res.render('user/logIn');
};

export const logIn = async (req, res, next) => {
	await User.findOne();
};

export const register = async (req, res, next) => {
	try {
		const user = await User.create(req.body);
		const token = newToken(user);
		req.flash(
			'success',
			`${req.body.name}, your account was successfully created.`
		);
		res.redirect('/');
	} catch (error) {
		console.log(`Error during user registration:`);
		console.log(error);
		console.log(error.message);
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
