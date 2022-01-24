import {Router} from 'express';
import * as fermentation from '../controllers/fermentation/index.js';

const router = Router();

router.get('/add', fermentation.renderRegistrationForm);

router.post('/add', fermentation.register);

router.param('id', fermentation.authoriseAndAttachToRequest);

router.get('/:id', fermentation.view);

router.post('/:id/delete', fermentation.deleteFermentation);

router.get('/:id/edit', fermentation.renderPopulatedEditForm); 

router.post('/:id/update', fermentation.update);

export default router;
