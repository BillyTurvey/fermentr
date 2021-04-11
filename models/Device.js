import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const deviceSchema = new mongoose.Schema({
	deviceID: {
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

const Fermentation = mongoose.model('Fermentation', deviceSchema);

export default Fermentation;