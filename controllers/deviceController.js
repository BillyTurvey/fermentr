import Device from '../models/Device.js';
import Reading from '../models/Reading.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import User from '../models/User.js';

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
		console.log(
			`device registered`,
			`Device Name: ${device.name}, Description: ${device.description}, Owner: ${device.owner}`
		);
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
	res.status(403).end();
};

export const authenticateDevice = (req, res, next) => {
	//
};

export const sanitiseReading = (req, res, next) => {
	validator.escape(req.body.deviceID);
	validator.escape(req.body.reading);
};

export const addReading = (req, res, next) => {
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

// WRITE  TESTS FOR THIS...
// ### Adding/Configuring a device for tracking
// - User navigates to 'Add Device' page
// - User must be logged in
// - There is a form to fill out which collects the following:
// 	- Device name
// - Upon submission the form will be posted to the server and the following will happen:
// 	- Input sanitisation.
// 	- The device name must be unique to the user ie. multiple users may have devices
//     with the same name but the same user may not have multiple devices with the same name.
// 	- The user may only register 5 devices, must check how many devices the user has.
// 	- An access token and device ID will be generated on the server and..
// 	- device will be saved to the database in the device collection...
// 		- with the **device name**
// 		- with the **deviceID**
// 		- with the hashed **accessToken**
// 		- with a mutual link to the user's document.
