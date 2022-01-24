import Fermentation from '../../models/Fermentation.js';

export const authoriseAndAttachToRequest = async (req, res, next, id) => {
	if (req.user && (await req.user.ownsFermentation(id))) {
		try {
			const fermentation = await Fermentation.findById(id).populate('assignedDevice').exec();
			req.fermentation = fermentation;
			next();
		} catch (error) {
			console.error(error);
			res.status(500).end();
		}
	} else {
		res.status(401).end();
	}
};
