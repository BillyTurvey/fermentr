import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Fermentr' });
});

router.get('/current-temp', (req, res, next) => {
	res.json(req);
});

router.get('/about', (req, res, next) => {
  res.render('topLevelPages/about', { title: 'About Fermentr' });
});

export default router;
