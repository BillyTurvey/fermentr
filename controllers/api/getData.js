import DataLog from '../../models/DataLog.js';

export const getTemperatureData = async (req, res) => {
	const dataLog = await DataLog.findById(req.fermentation.dataLog);
	const rawActual = dataLog.thermalProfile.actual;
	res.json(rawActual).end();
};
