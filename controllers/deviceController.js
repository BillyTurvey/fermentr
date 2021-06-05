import Device from '../models/Device.js';
import Reading from '../models/Reading.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';

export const generateTokenAndID = (req, res, next) => {
	res.locals.deviceID = uuidv4();
	res.locals.token = uuidv4();
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
		const device = await Device.create({
			deviceID: res.locals.deviceID,
			name: req.body.deviceName,
			description: req.body.description,
			tokenHash: res.locals.tokenHash,
			dateRegistered: Date.now(),
			owner: req.user._id
		});
		req.flash('success', 'Device Registered');
		return res.render('add-device', {
			title: 'Done!',
			flashes: req.flash(),
			device: device
		});
	} catch (error) {
		console.error(`Error during device registration: ${error.message}`);
		if (error.message.includes('E11000')) {
			error.message = `You already have a device named '${req.body.deviceName}', please choose a new name.`;
		}
		req.flash('error', error.message);
		res.render('add-device', {
			title: 'Register A New Device',
			deviceName: req.body.deviceName,
			flashes: req.flash()
		});
	}
};

export const addDeviceForm = (req, res, next) => {
	if (req.user) res.render('add-device', {title: 'Register A New Device'});
	res.status(401).end();
};

export const findAndAuthenticate = async (req, res, next, id) => {
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
};

export const sanitiseReading = (req, res, next) => {
	validator.escape(req.body.deviceID);
	validator.escape(req.body.reading);
};

export const logReading = (req, res, next) => {
	const reading = new Reading({
		value: req.body.value,
		time: Date.now(),
		deviceID: req.body.deviceID
	});
	reading.save().then(res.json({message: 'thank you'}));
};

export const sendTargetTemp = (req, res, next) => {
	//find fermentation in DB
	//calculate the time location
	//send it back to the device
};
