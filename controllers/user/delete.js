import User from '../../models/User.js';

export const confirmDelete = (req, res) => {
	res.render('user/confirmDelete');
};

export const deleteAccount = async (req, res, next) => {
	try {
		if (req.user) {
			await User.findByIdAndDelete(req.user._id).exec();
			req.flash('success', `User: ${req.user.name} was successfully deleted.`);
			res.redirect('/');
		} else {
			res.status(401).end();
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
};
