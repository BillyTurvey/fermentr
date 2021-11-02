import Fermentation from '../models/Fermentation.js';
import DataLog from '../models/DataLog.js';

export const processGraphRequest = async (req, res) => {
	const dataLog = DataLog.findById(req.fermentation.dataLog);

	const rawActual = dataLog.thermalProfile.actual;
	const graphWidth = req.query.width;
	const startTime = rawActual[0].time;
	const endTime = rawActual[rawActual.length - 1].time;
	const timeRange = endTime - startTime;
	const timePerPixel = timeRange / graphWidth;
};
