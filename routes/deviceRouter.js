import {Router} from 'express';
import * as device from '../controllers/deviceController.js';
import * as validate from '../utils/validation.js';


const router = Router();

router.get('/add', device.addDeviceForm);

router.post('/add', 
validate.sanitizeAndValidateDevice, 
device.generateKey,
device.hashKey,
device.addToDatabase
);

router.param('id', device.authenticateAndAttachToReq);

router.get('/:id', device.view);

router.post('/:id/delete', device.deleteDevice);

router.post('/:id/update', 
	validate.sanitizeAndValidateDevice,
	device.update
);

router.get('/:id/edit', device.editDeviceForm);

// requests handled below here will have no session
router.use(function removeSessionFromRequest(req, res, next) {
	req.session = null;
	next();
});

router.post('/:id/log',
	device.logReading 
);

export default router;
