import {Router} from 'express';
import * as device from '../controllers/deviceController.js';
import * as validate from '../utils/validation.js';
import Device from '../models/Device.js';


const router = Router();

device.param('deviceID', device.findAndAuthenticate);

router.get('/add', device.addDeviceForm);

router.post('/add', 
validate.sanitizeAndValidateDeviceRegistration, 
device.generateTokenAndID,
device.hashToken,
device.addDeviceToDatabase
);

router.post('device/:deviceID/log',
	device.authenticate, 
	device.logReading, 
	device.respond
);


export default router;
