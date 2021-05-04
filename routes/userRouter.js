import {Router} from 'express';
import * as user from '../controllers/userController.js';
import * as validate from '../utils/validation.js';

const router = Router();

router.get('/logIn', user.logInForm);
router.post(
	'/logIn',
	validate.validateLogIn, //
	user.logIn
);

router.get('/register', user.registrationForm);
router.post(
	'/register',
	validate.sanitizeAndValidateRegistration, //squash these three validations into the registration controller
	validate.checkIfPasswordsMatch,
	validate.handleRegistrationValidationErrors,
	user.register
);

export default router;
