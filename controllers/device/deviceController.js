import Device from '../../models/Device.js';
import DataLog from '../../models/DataLog.js';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import * as sanitizeAndValidate from '../../utils/validation/index.js';

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

export const addDeviceToDatabase = async (req, res) => {
	try {
		const device = await Device.create({
			deviceID: res.locals.deviceID,
			name: req.body.name,
			description: req.body.description,
			keyHash: res.locals.keyHash,
			owner: req.user._id,
			assignedFermentation:
				req.body.assignedFermentation === 'null' ? null : req.body.assignedFermentation
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

export const updateDeviceDBRecord = async (req, res) => {
	try {
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

export const update = [sanitizeAndValidate.device, updateDeviceDBRecord];

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
	res.render('device/editDevice', {
		title: `Edit ${req.device.name}`,
		device: req.device,
		fermentations: req.user.fermentations
	});
};

export const deleteDevice = async function (req, res, next) {
	try {
		await Device.findByIdAndDelete(req.device._id).exec();
		req.flash('success', `Device: ${req.device.name} was successfully deleted.`);
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
		try {
			const device = await Device.findById(id).populate('assignedFermentation').exec();
			req.device = device;
			next();
		} catch (error) {
			console.error(error);
			res.status(401).end();
		}
	} else if (req.header('device-key')) {
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
		if (!req.device) {
			res.status(400).json({
				message: 'Device configuration error, check authentication credentials.'
			});
			throw new Error(
				'This device is not assigned to a fermentation, therefore the data it is submitting cannot be saved.'
			);
		}
		const fermentation = req.device.assignedFermentation;
		if (!fermentation) {
			res.status(400).json({
				message:
					'Error! This device is not assigned to a fermentation, therefore the data it is submitting cannot be saved.'
			});
			throw new Error(
				'This device is not assigned to a fermentation, therefore the data it is submitting cannot be saved.'
			);
		}
		try {
			const dataLog = await DataLog.findById(fermentation.dataLog).exec();
			dataLog.thermalProfile.actual.push({
				time: Date.now(),
				temp: req.body.temperature
			});
			dataLog.save();
			res.status(200).json({
				message: 'Thank you! Your reading has been saved to the database.'
			});
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

export const register = [
	sanitizeAndValidate.device,
	generateKey,
	hashKey,
	addDeviceToDatabase
];