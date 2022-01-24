import Device from '../../models/Device.js';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import * as sanitizeAndValidate from '../../utils/validation/index.js';

export const addDeviceForm = async (req, res, next) => {
	if (req.user) {
		res.render('device/addDevice', {
			title: 'Register A New Device',
			user: req.user
		});
	}
	res.status(401).end();
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

export const register = [
	sanitizeAndValidate.device,
	generateKey,
	hashKey,
	addDeviceToDatabase
];
