import {Router} from 'express';
import * as api from '../controllers/apiController.js';
import * as fermentation from '../controllers/fermentationController.js';

const router = Router();

router.param('id', fermentation.authenticateAndAttachToReq);

router.get('/:id/graph', fermentation.retrieveAndProcessGraphData);

export default router;
