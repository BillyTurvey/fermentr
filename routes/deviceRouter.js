import {Router} from 'express';
import * as device from '../controllers/deviceController.js';
import * as validate from '../utils/validation.js';

const router = Router();

router.post('/incoming', (req, res, next) => {
	authenticateDevice, addReading, sendTargetTemp;
});

router.get('/add', device.addDeviceForm);

router.post('/add', 
	(req, res, next) => {console.log('MELON'); next()},
	validate.sanitizeAndValidateDeviceRegistration, 
	device.add);

router.post('device/:deviceID/reading', (req, res) => {
	res.send(req.params);
});

export default router;
