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
			try {
				const user = await User.findOne({email: username})
					.populate('devices')
					.populate('fermentations')
					.exec();
				if (!user) {
					return done(null, false, {message: 'Invalid credentials.'});
				}
				if (!user.isAuthenticated(password)) {
					return done(null, false, {message: 'Invalid credentials.'});
				}
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		delete user.password;
		done(err, user);
	});
});

export default passport;
