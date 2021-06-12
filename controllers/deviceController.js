import Device from '../models/Device.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';

export const generateTokenAndID = (req, res, next) => {
	res.locals.deviceID = uuidv4();
	res.locals.token = uuidv4();
	console.log(`change this`);
	next();
};

export const hashToken = (req, res, next) => {
	const saltRounds = 12; //
	bcrypt.hash('newID', saltRounds).then((hash) => {
		res.locals.tokenHash = hash;
		next();
	});
};

export const addDeviceToDatabase = async (req, res) => {
	try {
		// pre-save middleware on the device model checks if device name is unique to user
		//				 and adds the device id to the user db entry
		const device = await Device.create({
			deviceID: res.locals.deviceID,
			name: req.body.deviceName,
			description: req.body.description,
			tokenHash: res.locals.tokenHash,
			dateRegistered: Date.now(),
			owner: req.user._id
		});
		req.flash('success', 'Device registered.');
		return res.render('device/addDevice', {
			title: 'Done!',
			flashes: req.flash(),
			device: device,
			deviceToken: res.locals.token
		});
	} catch (error) {
		console.error(`Error during device registration: ${error.message}`);
		if (error.message.includes('E11000')) {
			error.message = `You already have a device named '${req.body.deviceName}', please choose a new name.`;
		}
		req.flash('error', error.message);
		res.render('device/addDevice', {
			title: 'Register A New Device',
			deviceName: req.body.deviceName, //TODO This is out of date
			flashes: req.flash()
		});
	}
};

export const addDeviceForm = async (req, res, next) => {
	await req.user.populate('fermentations').execPopulate();
	if (req.user) {
		res.render('device/addDevice', {
			title: 'Register A New Device',
			fermentations: req.user.fermentations
		});
	}
	res.status(401).end();
};

export const editDevice = async (req, res, next) => {
	await req.user.populate('fermentations').execPopulate();
	res.render('device/editDevice', {
		title: `Edit ${req.device.name}`,
		device: req.device,
		fermentations: req.user.fermentations
	});
};

export const authenticateAndAttachToReq = async (req, res, next, id) => {
	console.log(`🙉`);
	if (req.user && req.user.devices.contains('id')) {
		//user logged in trying to view or edit device
		try {
			const device = await Device.findById(id).exec();
			// const device = await (await Device.findById(id).populate('currentFermentation')).execPopulate();
			req.device = device;
			next();
		} catch (error) {
			console.error(error);
			res.status(401).end();
		}
	} else {
		// device posting data to be logged
		try {
			const device = await Device.findById(id);
			const key = req.getHeader('device-key');
			if (device.isAuthenticated(key)) {
				req.device = device;
				next();
			} else {
				throw new Error('Device authentication failed.');
			}
		} catch (error) {
			console.error(error);
			res.status(401).end();
		}
	}
};

export const logReading = async (req, res, next) => {
	try {
		const fermentation = await Fermentation.findById(req.device.activeFermenation); //Populate the fermentation when the device is retreived from the database?
		fermentation.temmperature.actual.push({
			time: Date.now(),
			temp: req.body.temmperature
		});
		next();
	} catch (error) {}
};

export const sendTargetTemp = (req, res) => {
	//find fermentation in DB
	//calculate the time location
	//send it back to the device
};
