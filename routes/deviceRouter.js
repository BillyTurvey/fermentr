import {Router} from 'express';
import * as device from '../controllers/device/deviceController.js';
import { removeSessionFromRequest } from '../utils/utils.js';

const router = Router();

router.get('/add', device.addDeviceForm);

router.post('/add', device.register);

router.param('id', device.authenticateAndAttachToReq);

router.get('/:id', device.view);

router.post('/:id/delete', device.deleteDevice);

router.post('/:id/update', device.update);

router.get('/:id/edit', device.editDeviceForm);

router.use(removeSessionFromRequest);

router.post('/:id/log',	device.logReading);

export default router;
