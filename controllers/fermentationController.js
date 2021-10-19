import Fermentation from '../models/Fermentation.js';

export const renderEmptyEditFermentationForm = async (req, res) => {
	if (req.user) {
		return res.render('fermentation/editFermentation', {
			title: 'Add New Fermentation',
			devices: req.user.devices || [],
			editingExisitngFermentation: false
		});
	}
	res.status(401).end();
};

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

export const update = async (req, res, next) => {
	try {
		if (req.body.assignedDevice === 'null') req.body.assignedDevice = null;
		const fermentation = req.fermentation;
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

export const addToDatabase = async (req, res, next) => {
	try {
		// pre-validate middleware on the fermentation model checks the device ID is valid
		// and that the device is owned by the user who is creating the fermentation.

		// pre-save middleware on the fermentation model adds the fermentation id to the User db entry
		// post-save middleware on the fermentation model the activeFermentation field on the device is updated

		const fermentation = await Fermentation.create({
			name: req.body.name,
			description: req.body.description,
			dateRegistered: Date.now(),
			user: req.user._id,
			assignedDevice: req.body.assignedDevice === ('null' || undefined) ? null : req.body.assignedDevice
		});
		req.flash('success', 'Fermentation added.');
		return res.redirect(`/fermentation/${fermentation._id}`);
	} catch (error) {
		console.error(`Error during fermentation registration: ${error.message}`);
		if (error.message.includes('E11000')) {
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

export const deleteFermentation = async function (req, res, next) {
	// pre delete hook on the fermentation model removes the fermentation id from the user's db entry
	try {
		await Fermentation.findByIdAndDelete(req.fermentation._id).exec();
		req.flash('success', `Fermentation: ${req.fermentation.name} was successfully deleted.`);
		res.redirect('/user/dashboard');
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const view = async (req, res, next) => {
	const fermentation = await req.fermentation.populate('dataLog').execPopulate();
	res.render('fermentation/viewFermentation', {
		title: fermentation.name,
		fermentation: fermentation
	});
};

export const authenticateAndAttachToReq = async (req, res, next, id) => {
	if (req.user && (await req.user.ownsFermentation(id))) {
		try {
			const fermentation = await Fermentation.findById(id).populate('assignedDevice').exec();
			req.fermentation = fermentation;
			next();
		} catch (error) {
			console.error(error);
			res.status(500).end();
		}
	} else {
		res.status(401).end();
	}
};
