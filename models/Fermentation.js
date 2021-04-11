import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const fermentationSchema = new mongoose.Schema({
	fermentationID: {
		type: String,
		required: true
	},
	name: {
		type: String,
		trim: true,
	},
	temperature: {
		actual: [{
			time: Number,
			value: Number
		}]
	}
});

const Fermentation = mongoose.model('Fermentation', fermentationSchema);

export default Fermentation;