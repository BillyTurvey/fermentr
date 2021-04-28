import User from '../models/User.js'
import { body, param, validationResult } from 'express-validator';


export const registrationForm = (req, res, next) => {
	res.render('user/register');
};

export const sanitizeAndValidateRegistration = [
  body('name', 'Name is a required field.').escape().trim().notEmpty(),
  body('name', 'Your entered name is tool long').isByteLength({min:1, max:200}),
	body('email', 'Email is a required field.').escape().trim().notEmpty(),
	body('email', 'Email is not valid.').isEmail().normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false,
	}),
	body('password', 'Password is not valid.').escape().notEmpty().isLength({min:8}),
	body('passwordConfirm', 'Password confirmation cannot be blank.').escape().notEmpty(),
];

export const checkIfPasswordsMatch =	async (req, res, next) => {
	if (req.body.password) {
		await body('passwordConfirm').escape()
		.equals(req.body.password).withMessage('Passwords do not match.')
			.run(req);
		};
		next();
};

export const handleRegistrationValidationErrors = (req, res, next) => 	{
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		req.flash('error', errors.array().map(err => err.msg));
		res.render('user/register', {
			title: 'Register', 
			email: req.body.email,
			name: req.body.name, 
			flashes: req.flash(),
	});
	} else {
		next();
	}
};

export const register = async (req, res, next) => {
	User.create(req.body)
		.then( () => {
			req.flash('success', `${req.body.name}, your account was successfully created.`);
			res.redirect('/');
			console.log('USER CREATED:', req.user);
		})
		.catch(error => {
				console.log(`Error during user registration:`);
				console.log(error);
				console.log(error.message);
				if (error.message.includes('E11000')) {
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