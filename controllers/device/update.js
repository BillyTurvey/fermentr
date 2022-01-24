import * as sanitizeAndValidate from '../../utils/validation/index.js';

export const editDeviceForm = async (req, res, next) => {
	res.render('device/editDevice', {
		title: `Edit ${req.device.name}`,
		device: req.device,
		fermentations: req.user.fermentations
	});
};

export const updateDeviceDBRecord = async (req, res) => {
	try {
		const device = req.device;
		device.name = req.body.name;
		device.description = req.body.description;
		device.assignedFermentation =
			req.body.assignedFermentation === 'null' ? null : req.body.assignedFermentation;
		await device.save();

		req.flash('success', 'Device updated.');
		return res.redirect(`/device/${req.device._id}`);
	} catch (error) {
		console.error(`Error during device registration: ${error.message}`);
		if (error.message.includes('E11000')) {
			error.message = `You already have a device named '${req.body.name}', please choose a new name.`;
		}
		req.flash('error', error.message);
		res.render('device/addDevice', {
			title: 'Register A New Device',
			name: req.body.name,
			flashes: req.flash()
		});
	}
};

export const update = [sanitizeAndValidate.device, updateDeviceDBRecord];
