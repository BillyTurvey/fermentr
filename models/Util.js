import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const utilSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	value: {}
});

const Util = mongoose.model('Util', utilSchema);

export default Util;
