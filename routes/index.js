import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Fermentr' });
});



router.post('/incoming', (req, res, next) => {
  console.log(`🍺  INCOMING...  🌡`);
  console.log(req.body);
});

export default router;
