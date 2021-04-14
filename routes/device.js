import express from 'express';
import { addDevice, authenticateDevice, addReading, sendTargetTemp } from '../controllers/deviceController.js';
var router = express.Router();

router.post('/incoming', (req, res, next) => {
  authenticateDevice,
  addReading,
  sendTargetTemp
});

router.get('/add-new', (req, res, next) => {
  res.render('add-device', {title: 'Add New Device'});
});

router.post('add-new', addDevice);

export default router;
