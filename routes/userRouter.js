import {Router} from 'express';
import * as user from '../controllers/userController.js';
import * as validate from '../utils/validation.js';

const router = Router();

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

router.post('/register',
validate.sanitizeAndValidateUser,
user.register,
user.logIn
);

router.use(function removeSessionFromRequest(req, res, next) {
	req.session = null;
	res.locals.flashes = null;
	next();
});

router.get('/logIn', user.logInForm);
router.get('/register', user.registrationForm);

export default router;
