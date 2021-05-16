import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Fermentr' });
});

router.get('/current-temp', (req, res, next) => {
	res.json(req);
});

router.post('/incoming', (req, res, next) => {
	res.json(req);
});

export default router;
