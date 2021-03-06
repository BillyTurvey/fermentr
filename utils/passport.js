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
				const userIsAuthenticated = await user.isAuthenticated(password);
				if (userIsAuthenticated == false) {
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

passport.deserializeUser(async function (id, done) {
	try {
		const user = await User.findById(id).populate('devices').populate('fermentations').exec();
		done(null, user);
	} catch (error) {
		done(error);
	}
});

export default passport;
