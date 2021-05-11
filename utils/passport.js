import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/User.js';

// change these to arrows after it's working
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		// Check here, username/email?
		function (email, password, done) {
			User.findOne({email: email}, function (err, user) {
				if (err) return done(err);
				if (!user) return done(null, false), {message: 'Invalid credentials.'};
				if (!user.verifyPassword(password)) return done(null, false, {message: 'Invalid credentials.'});
				return done(null, user);
			});
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

export default passport;
