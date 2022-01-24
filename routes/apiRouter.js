import {Router} from 'express';
import * as api from '../controllers/api/index.js';
import * as fermentation from '../controllers/fermentation/index.js'
import * as device from '../controllers/device/index.js'

const router = Router();

router.param('fermentationId', fermentation.authoriseAndAttachToRequest);
router.param('deviceId', device.authoriseAndAttachToRequest);

router.get('/fermentation/:fermentationId/temperature', api.getTemperatureData);

router.post('/device/:deviceId/log',	api.logReading);

export default router;
