import {Router} from 'express';
import * as device from '../controllers/deviceController.js';
import * as validate from '../utils/validation.js';


const router = Router();

router.param('deviceID', device.findAndAuthenticate);

router.get('/add', device.addDeviceForm);

router.post('/add', 
validate.sanitizeAndValidateDeviceRegistration, 
device.generateTokenAndID,
device.hashToken,
device.addDeviceToDatabase
);

router.post('device/:deviceID/log',
	device.logReading 
);


export default router;
