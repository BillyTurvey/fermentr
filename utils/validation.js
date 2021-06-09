import {body, validationResult} from 'express-validator';

export const validateLogIn = [
	body('email', 'Email is a required field.').escape().trim().notEmpty().normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	}),
	body('password', 'Password is not valid.').escape().notEmpty(),
	handleLoginValidationErrors
];

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

export const sanitizeAndValidateDevice = [
	body('deviceName', 'Device name is a required field.').escape().trim().notEmpty(),
	body(
		'deviceName',
		'Device name is too long, please limit to fewer than 30 alphanumeric characters.'
	).isLength({
		max: 30
	}),
	body('description', 'Description is too long, please limit to fewer than 100 characters.')
		.escape()
		.trim()
		.isLength({max: 100}),
	handleDeviceValidationErrors
];

function handleDeviceValidationErrors(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash(
			'error',
			errors.array().map((err) => err.msg)
		);
		res.render('addDevice', {
			title: 'Register A New Device',
			device: null,
			deviceName: req.body.deviceName,
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
	body('description', 'Description is too long, please limit to fewer than 100 characters.')
		.escape()
		.trim()
		.isLength({max: 100}),
	// body('targetOG', 'targetOG ... something').escape().isDecimal({force_decimal: true, decimal_digits: '3', locale: 'en-GB'}),
	// body('actualOG', 'actualOG ... something').escape().isDecimal({force_decimal: true, decimal_digits: '3', locale: 'en-GB'}),
	// body('targetFG', 'targetFG ... something').escape().isDecimal({force_decimal: true, decimal_digits: '3', locale: 'en-GB'}),
	// body('actualFG', 'actualFG ... something').escape().isDecimal({force_decimal: true, decimal_digits: '3', locale: 'en-GB'}),
	body('targetOG', 'targetOG ... something').escape(),
	body('actualOG', 'actualOG ... something').escape(),
	body('targetFG', 'targetFG ... something').escape(),
	body('actualFG', 'actualFG ... something').escape(),
	handleFermentationValidationErrors
];

function handleFermentationValidationErrors(req, res, next) {
	const errors = validationResult(req);
	console.log(`🦞 Fermentation errors:`);
	console.log(errors);
	if (!errors.isEmpty()) {
		req.flash(
			'error',
			errors.array().map((err) => err.msg)
		);
		res.render('fermentation/editFermentation', {
			title: 'Add New Fermentation',
			editingExhistingFermentation: false,
			name: req.body.name,
			description: req.body.description,
			targetOG: parseFloat(req.body.targetOG),
			actualOG: parseFloat(req.body.actualOG),
			targetFG: parseFloat(req.body.targetFG),
			actualFG: parseFloat(req.body.actualFG),
			flashes: req.flash()
		});
	} else {
		next();
	}
}

// function stringifyNumericFormInputs(req, res, next) {
// 	console.log(`🐳 in stringifyNumericFormInputs`);
// 	if (req.body.targetOG) req.body.targetOG.toString();
// 	if (req.body.actualOG) req.body.actualOG.toString();
// 	if (req.body.targetFG) req.body.targetFG.toString();
// 	if (req.body.actualFG) req.body.actualFG.toString();
// 	next();
// }

function stringifyNumericFormInputs(req, res, next) {
	// may need this when validating gravity values
	for (let input in req.body) {
		req.body[input] = req.body[input] ? req.body[input] : '';
		req.body[input] = typeof req.body[input] == 'number' ? req.body[input].toString() : req.body[input];
	}
	next();
}
