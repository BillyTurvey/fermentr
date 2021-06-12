import {Router} from 'express';
import * as device from '../controllers/deviceController.js';
import * as validate from '../utils/validation.js';


const router = Router();

router.get('/add', device.addDeviceForm);

router.post('/add', 
validate.sanitizeAndValidateDevice, 
device.generateTokenAndID,
device.hashToken,
device.addDeviceToDatabase
);

router.param('id', function(req, res, next, id) {console.log('🦄', id)});

router.get('/:id/edit', device.editDevice);

router.post('device/:id/log',
	device.logReading 
);


export default router;
