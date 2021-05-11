import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/User';

// change these to arrows after it's working
passport.use(
	new LocalStrategy(function (email, password, done) {
		User.findOne({email: email}, function (err, user) {
			if (err) return done(err);
			if (!user) return done(null, false);
			if (!user.verifyPassword(password)) return done(null, false);
			return done(null, user);
		});
	})
);
