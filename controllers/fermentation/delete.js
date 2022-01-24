import Fermentation from '../../models/Fermentation.js';

export const deleteFermentation = async function (req, res, next) {
	try {
		await Fermentation.findByIdAndDelete(req.fermentation._id).exec();
		req.flash('success', `Fermentation: ${req.fermentation.name} was successfully deleted.`);
		res.redirect('/user/dashboard');
	} catch (error) {
		console.error(error);
		next(error);
	}
};
