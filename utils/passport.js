import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/User.js';

// change these to arrows after it's working
// passport.use(
// 	new LocalStrategy(
// 		{
// 			usernameField: 'email',
// 			passwordField: 'password'
// 		},
// 		function (username, password, done) {
// 			User.findOne({email: username}, function (err, user) {
// 				if (err) return done(err);
// 				if (!user) return done(null, false), {message: 'Invalid credentials. u'};
// 				if (!user.isAuthenticated(password)) return done(null, false, {message: 'Invalid credentials. p'});
// 				return done(null, user);
// 			});
// 		}
// 	)
// );

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async function (username, password, done) {
			try {
				var user = await User.findOne({email: username});
				if (user.isAuthenticated(password)) {
					return done(null, user);
				} else {
					if (!user) return done(null, false, {message: 'Invalid credentials. u'});
					return done(null, false, {message: 'Invalid credentials. p'});
				}
			} catch (error) {
				if (err) return done(err);
			}
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
