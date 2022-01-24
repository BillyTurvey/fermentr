import {Router} from 'express';
import * as device from '../controllers/device/index.js';

const router = Router();

router.get('/add', device.addDeviceForm);
router.post('/add', device.register);

router.param('id', device.authoriseAndAttachToRequest);
router.get('/:id', device.view);

router.get('/:id/edit', device.editDeviceForm);
router.post('/:id/update', device.update);

router.post('/:id/delete', device.deleteDevice);

export default router;
