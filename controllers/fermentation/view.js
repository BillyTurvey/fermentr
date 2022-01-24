import {makeTimeStrings} from '../../utils/utils.js';

export const view = async (req, res, next) => {
	const fermentation = await req.fermentation.populate('dataLog').execPopulate();
	if (fermentation.dataLog.thermalProfile.actual[0]) {
		var lastLog =
			fermentation.dataLog.thermalProfile.actual[
				fermentation.dataLog.thermalProfile.actual.length - 1
			];
		lastLog.timeDateString = makeTimeStrings(lastLog?.time).timeDateString;
	} else {
		var lastLog = false;
	}

	res.render('fermentation/viewFermentation', {
		title: fermentation.name,
		lastLog: lastLog,
		fermentation
	});
};
