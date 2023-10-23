import mongoose, { Schema } from 'mongoose';
import IPublisher from './types';

const PublisherSchema = new Schema<IPublisher>({
	name: {
		type: String,
		required: true,
	},
	congregation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Congregation',
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
})

const model = mongoose.model<IPublisher>('Publisher', PublisherSchema, 'publishers')

export default model