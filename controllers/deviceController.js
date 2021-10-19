import Device from '../models/Device.js';
import DataLog from '../models/DataLog.js';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';

export const generateKey = (req, res, next) => {
	res.locals.key = uuidv4();
	next();
};

export const hashKey = (req, res, next) => {
	const saltRounds = 12; //
	bcrypt.hash(res.locals.key, saltRounds).then(hash => {
		res.locals.keyHash = hash;
		next();
	});
};

export const addToDatabase = async (req, res) => {
	try {
		// pre save middleware on the device model...
		//// ...adds the device id to the fermentation document
		//// ...adds the device id to the user document
		const device = await Device.create({
			deviceID: res.locals.deviceID,
			name: req.body.name,
			description: req.body.description,
			keyHash: res.locals.keyHash,
			owner: req.user._id,
			assignedFermentation: req.body.assignedFermentation === 'null' ? null : req.body.assignedFermentation
		});
		req.flash('success', 'Device registered.');
		return res.render('device/addDevice', {
			title: 'Done!',
			flashes: req.flash(),
			device: device,
			deviceKey: res.locals.key
		});
	} catch (error) {
		console.error(`Error during device registration: ${error.message}`);
		if (error.message.includes('E11000')) {
			error.message = `You already have a device named '${req.body.name}', please choose a new name.`;
		}
		req.flash('error', error.message);
		res.render('device/addDevice', {
			title: 'Register A New Device',
			name: req.body.name,
			flashes: req.flash()
		});
	}
};

export const update = async (req, res) => {
	try {
		// pre save middleware on the device model...
		//// ...adds the device id to the fermentation document
		//// ...adds the device id to the user document

		const device = req.device;
		device.name = req.body.name;
		device.description = req.body.description;
		device.assignedFermentation =
			req.body.assignedFermentation === 'null' ? null : req.body.assignedFermentation;
		await device.save();

		req.flash('success', 'Device updated.');
		return res.redirect(`/device/${req.device._id}`);
	} catch (error) {
		console.error(`Error during device registration: ${error.message}`);
		if (error.message.includes('E11000')) {
			error.message = `You already have a device named '${req.body.name}', please choose a new name.`;
		}
		req.flash('error', error.message);
		res.render('device/addDevice', {
			title: 'Register A New Device',
			name: req.body.name,
			flashes: req.flash()
		});
	}
};

export const addDeviceForm = async (req, res, next) => {
	if (req.user) {
		res.render('device/addDevice', {
			title: 'Register A New Device',
			user: req.user
		});
	}
	res.status(401).end();
};

export const editDeviceForm = async (req, res, next) => {
	// if (!req.device) res.status()
	res.render('device/editDevice', {
		title: `Edit ${req.device.name}`,
		device: req.device,
		fermentations: req.user.fermentations
	});
};

export const deleteDevice = async function (req, res, next) {
	// pre delete hook on the device model removes the device id from the user's db entry
	try {
		await Device.findByIdAndDelete(req.device._id).exec();
		res.redirect('/user/dashboard');
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const view = async (req, res) => {
	res.render('device/viewDevice', {
		title: req.device.name,
		device: req.device
	});
};

export const authenticateAndAttachToReq = async (req, res, next, id) => {
	if (req.user && (await req.user.ownsDevice(id))) {
		//user is logged in and is trying to view or edit device they own
		try {
			const device = await Device.findById(id).populate('assignedFermentation').exec();
			req.device = device;
			next();
		} catch (error) {
			console.error(error);
			res.status(401).end();
		}
	} else if (req.header('device-key')) {
		// device posting data to be logged
		try {
			const device = await Device.findById(id).populate('assignedFermentation').exec();
			const key = req.header('device-key');
			if (await device.isAuthenticated(key)) {
				req.device = device;
				next();
			} else {
				throw new Error('Device authentication failed.');
			}
		} catch (error) {
			console.error(error);
			res.status(401).end();
		}
	} else {
		res.status(401).end();
	}
};

export const logReading = async (req, res, next) => {
	try {
		const fermentation = req.device.assignedFermentation;
		if (!fermentation) {
			res.status(403).end();
			throw new Error(
				'This device is not assigned to a fermentation, therefore the data it is submitting cannot be saved.'
			);
		}
		//Populate the fermentation when the device is retreived from the database?
		try {
			const dataLog = await DataLog.findById(fermentation.dataLog).exec();
			dataLog.thermalProfile.actual.push({
				time: Date.now(),
				temp: req.body.temperature
			});
			dataLog.save();
			res.status(200).end();
		} catch (error) {
			console.error(error);
		}
	} catch (error) {
		console.error(error);
	}
};

export const sendTargetTemp = (req, res) => {
	//find fermentation in DB
	//calculate the time location
	//send it back to the device
};
