import {body, validationResult} from 'express-validator';

export const fermentation = [
	body('name', 'Fermentation name is a required field.').escape().trim().notEmpty(),
	body(
		'name',
		'Fermentation name is too long, please limit to fewer than 30 alphanumeric characters.'
	).isLength({
		max: 30
	}),
	body('description', 'Description is too long, please limit to fewer than 600 characters.')
		.escape()
		.trim()
		.isLength({max: 600}),
	body('targetOG', 'targetOG ... something').escape().isLength({max: 6}),
	body('actualOG', 'actualOG ... something').escape().isLength({max: 6}),
	body('targetFG', 'targetFG ... something').escape().isLength({max: 6}),
	body('actualFG', 'actualFG ... something').escape().isLength({max: 6}),
	body('assignedDevice').escape(),
	handleFermentationValidationErrors
];

function handleFermentationValidationErrors(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash(
			'error',
			errors.array().map(err => err.msg)
		);
		if (req.headers.referer.includes('edit') || req.headers.referer.includes('update')) {
			res.render(`fermentation/editFermentation`, {
				title: `Edit ${req.fermentation.name}`,
				name: req.body.name,
				description: req.body.description,
				targetOG: req.body.targetOG,
				actualOG: req.body.actualOG,
				targetFG: req.body.targetFG,
				actualFG: req.body.actualFG,
				fermentation: req.fermentation,
				devices: req.user.devices || [],
				flashes: req.flash(),
				editingExistingFermentation: true
			});
		} else if (req.headers.referer.includes('add')) {
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
		} else {
			res.redirect(`/fermentation/${req.fermentation._id}`);
		}
	} else {
		next();
	}
}
