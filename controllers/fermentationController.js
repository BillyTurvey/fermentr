import Fermentation from '../models/Fermentation.js';

export const view = (req, res, next) => {};

export const renderEmptyEditFermentationForm = (req, res) => {
	if (req.user) {
		res.render('fermentation/editFermentation', {
			title: 'Add New Fermentation',
			editingExhisitngFermentation: false
		});
	}
	res.status(401).end();
};

export const renderPopulatedEditForm = (req, res) => {
	if (req.user)
		res.render('fermentation/editFermentation', {title: 'Add New Fermentation', fermentation: {}});
	res.status(401).end();
};

export const update = (req, res, next) => {};

export const addToDatabase = async (req, res, next) => {
	try {
		// pre-save middleware on the fermentation model adds the fermentation id to the User db entry
		const fermentation = await Fermentation.create({
			name: req.body.name,
			description: req.body.description,
			dateRegistered: Date.now(),
			user: req.user._id
		});
		req.flash('success', 'Fermentation added.');
		return res.redirect('/user/dashboard');
		// return res.render('viewfermentation', {
		// 	title: fermentation.name,
		// 	flashes: req.flash(),
		// 	fermentation: fermentation
		// });
	} catch (error) {
		console.error(`Error during fermentation registration: ${error.message}`);
		if (error.message.includes('E11000')) {
			error.message = `You already have a fermentation named '${req.body.name}', please choose a new name.`;
		}
		req.flash('error', error.message);
		res.render('fermentation/editFermentation', {
			title: 'Register A New fermentation',
			fermentationName: req.body.fermentationName,
			flashes: req.flash()
		});
	}
};

export const viewFermentation = (req, res, next) => {};
