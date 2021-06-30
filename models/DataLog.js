import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const dataLogSchema = new mongoose.Schema({
	thermalProfile: {
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
	},
	co2Activity: [
		{
			time: Number,
			value: Number //bubbles per minute
		}
	]
});

const DataLog = mongoose.model('DataLog', dataLogSchema);

export default DataLog;
