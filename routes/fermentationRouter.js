import {Router} from 'express';
import * as fermentation from '../controllers/fermentationController.js';
import * as validate from '../utils/validation.js';

const router = Router();

//to write: gets the populated edit form
router.get('/:fermentationID', fermentation.view); 

//to write: gets the blank add new fermentation form
router.get('/add', fermentation.renderEditForm);

//to write: gets the populated edit form
router.get('/:fermentationID/edit', fermentation.renderEditForm); 

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
