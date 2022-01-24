import {Router} from 'express';
import * as api from '../controllers/api/apiController.js';
import * as fermentation from '../controllers/fermentation/authorise.js'

const router = Router();

router.param('id', fermentation.authoriseAndAttachToRequest);

router.get('/:id/graph', api.retrieveAndProcessGraphData);

export default router;
