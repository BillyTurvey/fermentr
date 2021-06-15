import {Router} from 'express';
import * as fermentation from '../controllers/fermentationController.js';
import * as validate from '../utils/validation.js';

const router = Router();

router.get('/add', fermentation.renderEmptyEditFermentationForm);

router.post('/add', 
validate.sanitizeAndValidateFermentation, 
fermentation.addToDatabase 
);

router.param('id', fermentation.authenticateAndAttachToReq);

router.get('/:id', fermentation.view); 

router.get('/:id/edit', fermentation.renderPopulatedEditForm); 

router.put('/:id/update', 
validate.sanitizeAndValidateFermentation,
fermentation.update
);


export default router;
