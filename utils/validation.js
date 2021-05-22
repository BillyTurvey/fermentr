import {body, validationResult} from 'express-validator';

export const validateLogIn = [
	body('email', 'Email is a required field.').escape().trim().notEmpty().normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	}),
	body('password', 'Password is not valid.').escape().notEmpty().isLength({min: 8}),
	function handleLoginValidationErrors(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash(
				'error',
				errors.array().map((err) => err.msg)
			);
			res.render('user/logIn', {
				title: 'Log In',
				email: req.body.email,
				flashes: req.flash()
			});
		} else {
			next();
		}
	}
];

export const sanitizeAndValidateRegistration = [
	body('name', 'Name is a required field.').escape().trim().notEmpty(),
	body('name', 'Your entered name is tool long').isByteLength({min: 1, max: 200}),
	body('email', 'Email is a required field.').escape().trim().notEmpty(),
	body('email', 'Email is not valid.').isEmail().normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	}),
	body('password', 'Password is not valid.').escape().notEmpty().isLength({min: 8}),
	body('passwordConfirm', 'Password confirmation cannot be blank.').escape().notEmpty(),
	async function checkIfPasswordsMatch(req, res, next) {
		if (req.body.password) {
			await body('passwordConfirm')
				.escape()
				.equals(req.body.password)
				.withMessage('Passwords do not match.')
				.run(req);
		}
		next();
	},
	function handleRegistrationValidationErrors(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash(
				'error',
				errors.array().map((err) => err.msg)
			);
			res.render('user/register', {
				title: 'Register',
				email: req.body.email,
				name: req.body.name,
				flashes: req.flash()
			});
		} else {
			next();
		}
	}
];

export const sanitizeAndValidateDeviceRegistration = [
	body('deviceName', 'Device name is a required field.').escape().trim().notEmpty(),
	body('deviceName', 'Device name is too long, please limit to fewer than 30 characters.').isByteLength({
		max: 30
	}),
	body('description', 'Description is too long, please limit to fewer than 100 characters.')
		.escape()
		.trim()
		.isByteLength({max: 100}),
	function handleValidationErrors(req, res, next) {
		console.log(`🎾 in handle validation errors, for device named: ${req.body.deviceName}`);
		console.log(`🎾 device description: ${req.body.description}`);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(`errors not empty: ${errors}`);
			req.flash(
				'error',
				errors.array().map((err) => err.msg)
			);
			res.render('add-device', {
				title: 'Register A New Device',
				device: null,
				deviceName: req.body.deviceName,
				flashes: req.flash()
			});
		} else {
			console.log(`errors empty so calling next from sanitisation middleware`);
			next();
		}
	}
];
