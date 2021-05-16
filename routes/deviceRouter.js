import express from 'express';
import passport from 'passport';
import * as device from '../controllers/deviceController.js';
var router = express.Router();

router.post('/incoming', (req, res, next) => {
	authenticateDevice, addReading, sendTargetTemp;
});

router.get('/add', (req, res, next) => {
	passport.authenticate()
	res.render('add-device', {title: 'Add New Device'});
});

router.post('/add', device.add);

router.post('device/:deviceID/reading', (req, res) => {
	res.send(req.params);
});

export default router;
