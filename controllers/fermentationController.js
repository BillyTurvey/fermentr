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

export const addToDatabase = (req, res, next) => {};

export const viewFermentation = (req, res, next) => {};
