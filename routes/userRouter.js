import {Router} from 'express';
import * as user from '../controllers/user/index.js';
import { removeSessionFromRequest } from '../utils/utils.js';

const router = Router();

router.post('/logIn', user.logIn);

router.get('/dashboard', user.dashboard);

router.get('/updateAccount', user.userAccountForm);
// router.post('/account', user.updateAccount);

router.get('/deleteAccount', user.confirmDelete);
router.post('/deleteAccount', user.deleteAccount);

router.post('/logOut', user.logOut);

router.post('/register', user.register);

router.use(removeSessionFromRequest);

router.get('/logIn', user.logInForm);

router.get('/register', user.registrationForm);

export default router;
