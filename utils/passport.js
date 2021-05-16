import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/User.js';

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async function findAndAuthenticateUser(username, password, done) {
			User.findOne({email: username}, async function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {message: 'Invalid credentials.'});
				}
				if (!user.isAuthenticated(password)) {
					return done(null, false, {message: 'Invalid credentials.'});
				}
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
