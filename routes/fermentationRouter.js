import {Router} from 'express';
import * as fermentation from '../controllers/fermentationController.js';

const router = Router();

//to write: gets the populated edit form
router.get('/:fermentationID', fermentation.viewFermentation); 

//to write: gets the blank add new fermentation form
router.get('/add', fermentation.addFermentationForm);

//to write: gets the populated edit form
router.get('/:fermentationID/edit', fermentation.addFermentationForm); 

//to write: updates the entry in the db
router.put('/:fermentationID/update', 
validate.sanitizeAndValidateFermentation,
fermentation.updateFermentation
);

router.post('/add', 
validate.sanitizeAndValidateFermentation, //to write
fermentation.addFermentationToDatabase //to write
);

router.post('/:fermentationID/log',
	fermentation.logReading 
);


export default router;
