import Fermentation from '../../models/Fermentation.js';
import * as sanitizeAndValidate from '../../utils/validation/index.js';

export const renderRegistrationForm = async (req, res) => {
	if (req.user) {
		return res.render('fermentation/editFermentation', {
			title: 'Add New Fermentation',
			devices: req.user.devices || [],
			editingExisitngFermentation: false
		});
	}
	res.status(401).end();
};

export const addFermentationToDatabase = async (req, res, next) => {
	try {
		const fermentation = await Fermentation.create({
			name: req.body.name,
			description: req.body.description,
			dateRegistered: Date.now(),
			user: req.user._id,
			assignedDevice:
				req.body.assignedDevice === ('null' || undefined) ? null : req.body.assignedDevice
		});
		req.flash('success', 'Fermentation added.');
		return res.redirect(`/fermentation/${fermentation._id}`);
	} catch (error) {
		console.error(`Error during fermentation registration: ${error.message}`);
		if (error.code === 11000) {
			error.message = `You already have a fermentation named '${req.body.name}', please choose a new name.`;
		}
		req.flash('error', error.message);
		res.render('fermentation/editFermentation', {
			title: 'Register A New fermentation',
			devices: req.user.devices || [],
			fermentationName: req.body.fermentationName,
			flashes: req.flash()
		});
	}
};

export const register = [
	sanitizeAndValidate.fermentation, //
	addFermentationToDatabase
];
