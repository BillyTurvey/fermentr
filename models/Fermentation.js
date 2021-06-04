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
		required: true
	},
	description: {
		type: String,
		trim: true
	},
	recipe: {
		malt: String,
		hops: String,
		yeast: String
	},
	gravity: {
		targetOG: Number,
		actualOG: Number,
		targetFG: Number,
		actualFG: Number
	},
	startTime: Number,
	temperature: {
		target: [
			{
				time: Number, //hours since pitching
				temp: Number //degrees C
			}
		],
		actual: [
			{
				time: Number,
				temp: Number
			}
		]
	}
});

const Fermentation = mongoose.model('Fermentation', fermentationSchema);

export default Fermentation;
