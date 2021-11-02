import Fermentation from '../models/Fermentation.js';

export const processGraphRequest = async (req, res) => {
	const graphSpec = {
		width: req.query.width,
		height: req.query.height
	};
	const rawThermalProfile = DataLog.findById();
};
