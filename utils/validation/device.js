import {body, validationResult} from 'express-validator';

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

export const device = [
	body('name', 'Device name is a required field.').escape().trim().notEmpty(),
	body(
		'name',
		'Device name is too long, please limit to fewer than 30 alphanumeric characters.'
	).isLength({
		max: 30
	}),
	body('description', 'Description is too long, please limit to fewer than 600 characters.')
		.escape()
		.trim()
		.isLength({max: 600}),
	body('assignedFermentation').escape(),
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
