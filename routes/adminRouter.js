import {Router} from 'express';
import * as admin from '../controllers/adminController.js';
import * as validate from '../utils/validation.js';


const router = Router();

router.param('user', admin.attachSubUserToReq);

router.get('user/:userId', admin.view);

router.post('/:user/delete', admin.deleteDevice);

router.post('/:id/update', 
	validate.sanitizeAndValidateDevice,
	admin.update
);

router.get('/:id/edit', admin.editDeviceForm);



export default router;
