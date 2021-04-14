import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
	value: { 
		type: Number, 
		required: true 
	},
	time: {
		type: Number, 
		required: true 
	},
	deviceID: {
		type: String, 
		required: true		
	}
});

const Reading = mongoose.model('Reading', readingSchema);

export default Reading;