import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const thermalProfileSchema = new mongoose.Schema({
	target: [
		{
			time: Number, //minutes since pitching
			temp: Number //degrees C
		}
	],
	actual: [
		{
			time: Number,
			temp: Number
		}
	]
});

const ThermalProfile = mongoose.model('ThermalProfile', thermalProfileSchema);

export default ThermalProfile;
