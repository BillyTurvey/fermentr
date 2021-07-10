import {body, validationResult} from 'express-validator';

export const validateLogIn = [
	body('email', 'Email is a required field.').escape().trim().notEmpty().normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	}),
	body('password', 'Password is not valid.').escape().notEmpty(),
	handleLogInValidationErrors
];

function handleLogInValidationErrors(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash(
			'error',
			errors.array().map(err => err.msg)
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

export const sanitizeAndValidateUser = [
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
	function handleUserValidationErrors(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash(
				'error',
				errors.array().map(err => err.msg)
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

export const sanitizeAndValidateDeviceLog = [
	body('temperature').escape().trim().notEmpty().isNumeric(),
	function sanitizeAndValidateDeviceLog(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({errors: errors.array().map(err => err.msg)});
		} else {
			next();
		}
	}
];

export const sanitizeAndValidateDevice = [
	body('name', 'Device name is a required field.').escape().trim().notEmpty(),
	body('name', 'Device name is too long, please limit to fewer than 30 alphanumeric characters.').isLength({
		max: 30
	}),
	body('description', 'Description is too long, please limit to fewer than 100 characters.')
		.escape()
		.trim()
		.isLength({max: 100}),
	body('fermentation').escape(),
	handleDeviceValidationErrors
];

function handleDeviceValidationErrors(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash(
			'error',
			errors.array().map(err => err.msg)
		);
		res.render('device/addDevice', {
			title: 'Register A New Device',
			device: null,
			name: req.body.name,
			flashes: req.flash()
		});
	} else {
		next();
	}
}

export const sanitizeAndValidateFermentation = [
	// stringifyNumericFormInputs,
	body('name', 'Fermentation name is a required field.').escape().trim().notEmpty(),
	body(
		'name',
		'Fermentation name is too long, please limit to fewer than 30 alphanumeric characters.'
	).isLength({
		max: 30
	}),
	body('description', 'Description is too long, please limit to fewer than 300 characters.')
		.escape()
		.trim()
		.isLength({max: 300}),
	// body('targetOG', 'targetOG ... something').escape().isDecimal({force_decimal: true, decimal_digits: '3', locale: 'en-GB'}),
	// body('actualOG', 'actualOG ... something').escape().isDecimal({force_decimal: true, decimal_digits: '3', locale: 'en-GB'}),
	// body('targetFG', 'targetFG ... something').escape().isDecimal({force_decimal: true, decimal_digits: '3', locale: 'en-GB'}),
	// body('actualFG', 'actualFG ... something').escape().isDecimal({force_decimal: true, decimal_digits: '3', locale: 'en-GB'}),
	body('targetOG', 'targetOG ... something').escape().isLength({max: 6}),
	body('actualOG', 'actualOG ... something').escape().isLength({max: 6}),
	body('targetFG', 'targetFG ... something').escape().isLength({max: 6}),
	body('actualFG', 'actualFG ... something').escape().isLength({max: 6}),
	handleFermentationValidationErrors
];

function handleFermentationValidationErrors(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash(
			'error',
			errors.array().map(err => err.msg)
		);
		switch (req.header('referer')) {
			case 'fermentation/*/update':
				res.render(`fermentation/${req.fermentation._id}/update`, {
					title: `Edit ${req.fermentation.name}`,
					name: req.body.name,
					description: req.body.description,
					targetOG: req.body.targetOG,
					actualOG: req.body.actualOG,
					targetFG: req.body.targetFG,
					actualFG: req.body.actualFG,
					fermentation: req.fermentation
				});
				break;

			case `fermentation/add`:
				res.render('fermentation/editFermentation', {
					title: 'Add New Fermentation',
					editingExistingFermentation: false,
					devices: req.user.devices || [],
					name: req.body.name,
					description: req.body.description,
					targetOG: parseFloat(req.body.targetOG),
					actualOG: parseFloat(req.body.actualOG),
					targetFG: parseFloat(req.body.targetFG),
					actualFG: parseFloat(req.body.actualFG),
					flashes: req.flash()
				});

			default:
				res.redirect(`fermentation/${req.fermentation._id}`);
				break;
		}
	} else {
		next();
	}
}

function stringifyNumericFormInputs(req, res, next) {
	// may need this when validating gravity values
	for (let input in req.body) {
		req.body[input] = req.body[input] ? req.body[input] : '';
		req.body[input] = typeof req.body[input] == 'number' ? req.body[input].toString() : req.body[input];
	}
	next();
}
