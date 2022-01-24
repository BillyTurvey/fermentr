export const dashboard = async (req, res) => {
	if (req.user) {
		return res.render('user/dashboard', {
			title: 'Dashboard',
			fermentations: req.user.fermentations || [],
			devices: req.user.devices || []
		});
	}
	res.status(401).end();
};
