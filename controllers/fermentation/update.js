import * as sanitizeAndValidate from '../../utils/validation/index.js';

export const renderPopulatedEditForm = async (req, res) => {
	if (req.user) {
		res.render('fermentation/editFermentation', {
			title: 'Edit Fermentation',
			devices: req.user.devices || [],
			editingExistingFermentation: true,
			fermentation: req.fermentation
		});
	}
	res.status(401).end();
};

export const updateDatabaseDocument = async (req, res, next) => {
	try {
		if (req.body.assignedDevice === 'null') req.body.assignedDevice = null; // move this to pre update middleware

		const fermentation = req.fermentation; // destructuring
		fermentation.name = req.body.name;
		fermentation.description = req.body.description;
		fermentation.targetOG = req.body.targetOG;
		fermentation.actualOG = req.body.actualOG;
		fermentation.targetFG = req.body.targetFG;
		fermentation.actualFG = req.body.actualFG;
		fermentation.assignedDevice = req.body.assignedDevice;

		await fermentation.save();
		res.redirect(`/fermentation/${req.fermentation._id}`);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const update = [
	sanitizeAndValidate.fermentation, //
	updateDatabaseDocument
];
