import DataLog from '../../models/DataLog.js';

export const logReading = async (req, res, next) => {
	try {
		if (!req.device) {
			res.status(401).json({
				message: 'Device configuration error, check authentication credentials.'
			});
			throw new Error('Not authorized, data cannot be saved.');
		}
		const fermentation = req.device.assignedFermentation;
		if (!fermentation) {
			res.status(405).json({
				message:
					'Error! This device is not assigned to a fermentation, therefore the data it is submitting cannot be saved.'
			});
			throw new Error(
				'This device is not assigned to a fermentation, therefore the data it is submitting cannot be saved.'
			);
		}
		try {
			const dataLog = await DataLog.findById(fermentation.dataLog).exec();
			dataLog.thermalProfile.actual.push({
				time: Date.now(),
				temp: req.body.temperature
			});
			dataLog.save();
			res.status(200).json({
				message: 'Thank you! Your reading has been saved to the database.'
			});
		} catch (error) {
			console.error(error);
		}
	} catch (error) {
		console.error(error);
	}
};

export const sendTargetTemp = (req, res) => {
	//find fermentation in DB
	//calculate the time location
	//send it back to the device
};
