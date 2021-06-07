import {Router} from 'express';
import * as fermentation from '../controllers/fermentationController.js';
import * as validate from '../utils/validation.js';

const router = Router();

//to write: gets the populated edit form
// router.get('/:fermentationID', fermentation.view); 

router.get('/add', fermentation.renderEmptyEditFermentationForm);

//to write: gets the populated edit form
router.get('/:fermentationID/edit', fermentation.renderPopulatedEditForm); 

//to write: updates the entry in the db
router.put('/:fermentationID/update', 
validate.sanitizeAndValidateFermentation,
fermentation.update
);

router.post('/add', 
validate.sanitizeAndValidateFermentation, //to write
fermentation.addToDatabase //to write
);

export default router;
