import passport from 'passport';
import * as sanitizeAndValidate from '../../utils/validation/index.js';

export const logInForm = (req, res) => {
	res.render('user/logIn');
};

export const authenticateUserAndEstablishSession = (req, res, next) => {
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			req.flash('error', 'Login failed.');
			return res.render('user/logIn', {
				title: 'Log In',
				email: req.body.email,
				flashes: req.flash()
			});
		}
		req.logIn(user, async function (err) {
			if (err) return next(err);
			req.flash('success', 'Login successful.');
			res.redirect('/user/dashboard');
		});
	})(req, res, next);
};

export const logIn = [
	sanitizeAndValidate.logIn, //
	authenticateUserAndEstablishSession
];
