import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local'; //This may be the source of your problems....
import * as user from '../controllers/userController.js';
var router = express.Router();

passport.use(new LocalStrategy.Strategy(
	function(username, password, done) {
	  User.findOne({ username: username }, function (err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		if (!user.verifyPassword(password)) { return done(null, false); }
		return done(null, user);
	  });
	}
  ));

router.post('/logIn',
	passport.authenticate('local', {failureRedirect: '/logIn'}),
	(req, res) => { res.redirect('/') }
);

router.get('/register', user.registrationForm);
router.post('/register', );

export default router;
