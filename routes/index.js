import {Router} from 'express';
const router = Router();

router.get('/', (req, res, next) => {
	if (req.user) return res.redirect('/user/dashboard');
	next();
});

router.use(function removeSessionFromRequest(req, res, next) {
	req.session = null;
	next();
});

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Fermentr' });
});

router.get('/about', (req, res, next) => {
  res.render('topLevelPages/about', { title: 'About Fermentr' });
});

export default router;
