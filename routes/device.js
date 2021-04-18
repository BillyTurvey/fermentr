import express from 'express';
import * as device from '../controllers/deviceController.js';
var router = express.Router();

// Authentication middleware for devices
// passport.use(new TokenStrategy.Strategy(strategyOptions,
//   function (token, done) {
//       User.findOne({token: token}, function (err, device) {
//           if (err) {
//               return done(err);
//           }
//           if (!user) {
//               return done(null, false);
//           }
//           if (!user.verifyToken(token)) {
//               return done(null, false);
//           }
//           return done(null, user);
//       });
//   }
// ));

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
