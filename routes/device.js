import express from 'express';
import * as device from '../controllers/deviceController.js';
var router = express.Router();

router.post('/incoming', (req, res, next) => {
  authenticateDevice,
  addReading,
  sendTargetTemp
});

router.get('/add-new', (req, res, next) => {
  res.render('add-device', {title: 'Add New Device'});
});

router.post('/add-new', device.add);

router.put('device/:deviceID/reading', (req, res) => {
  res.send(req.params);
});

export default router;
