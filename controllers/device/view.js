export const view = async (req, res) => {
	res.render('device/viewDevice', {
		title: req.device.name,
		device: req.device
	});
};
