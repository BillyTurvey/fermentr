import Device from '../../models/Device.js';

export const deleteDevice = async function (req, res, next) {
	try {
		await Device.findByIdAndDelete(req.device._id).exec();
		req.flash('success', `Device: ${req.device.name} was successfully deleted.`);
		res.redirect('/user/dashboard');
	} catch (error) {
		console.error(error);
		next(error);
	}
};
