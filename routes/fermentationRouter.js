import {Router} from 'express';
import * as fermentation from '../controllers/fermentationController.js';
import * as validate from '../utils/validation.js';

const router = Router();

// router.get('/:fermentationID', fermentation.view); 

router.get('/add', fermentation.renderEmptyEditFermentationForm);

router.get('/:fermentationID/edit', fermentation.renderPopulatedEditForm); 

router.put('/:fermentationID/update', 
validate.sanitizeAndValidateFermentation,
fermentation.update
);

router.post('/add', 
validate.sanitizeAndValidateFermentation, 
fermentation.addToDatabase 
);

export default router;
