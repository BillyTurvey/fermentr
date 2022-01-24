export const logOut = (req, res) => {
	req.logout();
	req.flash('success', 'You have successfully logged out.');
	res.redirect('/');
};
