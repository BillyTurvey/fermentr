import Device from '../../models/Device.js';

export const authoriseAndAttachToRequest = async (req, res, next, id) => {
	if (req.user && (await req.user.ownsDevice(id))) {
		try {
			const device = await Device.findById(id).populate('assignedFermentation').exec();
			req.device = device;
			next();
		} catch (error) {
			console.error(error);
			res.status(401).end();
		}
	} else if (req.header('device-key')) {
		try {
			const device = await Device.findById(id).populate('assignedFermentation').exec();
			const key = req.header('device-key');
			if (await device.isAuthenticated(key)) {
				req.device = device;
				next();
			} else {
				throw new Error('Device authentication failed.');
			}
		} catch (error) {
			console.error(error);
			res.status(401).end();
		}
	} else {
		res.status(401).end();
	}
};
