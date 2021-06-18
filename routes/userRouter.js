import {Router} from 'express';
import * as user from '../controllers/userController.js';
import * as validate from '../utils/validation.js';

const router = Router();

router.get('/logIn', user.logInForm);
router.post('/logIn',
	validate.validateLogIn,
	user.logIn
);

router.get('/dashboard', user.dashboard);

router.get('/account', user.account);
router.post('/account', user.updateAccount);

router.get('/deleteAccount', user.confirmDelete);
router.post('/deleteAccount', user.deleteAccount);

router.post('/logOut', user.logOut);

router.get('/register', user.registrationForm);
router.post('/register',
	validate.sanitizeAndValidateUser,
	user.register,
	user.logIn
);

export default router;
