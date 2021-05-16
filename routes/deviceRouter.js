import express from 'express';
import passport from 'passport';
import * as device from '../controllers/deviceController.js';
var router = express.Router();

router.post('/incoming', (req, res, next) => {
	authenticateDevice, addReading, sendTargetTemp;
});

router.get('/add', (req, res, next) => {
	if (req.user)	res.render('add-device', {title: 'Add New Device'});
	res.status(403).end();
});

router.post('/add', device.add);

router.post('device/:deviceID/reading', (req, res) => {
	res.send(req.params);
});

export default router;
