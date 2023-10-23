import mongoose, { CallbackError, Schema } from 'mongoose';
import { normalization } from '../../helpers/normalization';
import IPublisher from './types';

const PublisherSchema = new Schema<IPublisher>({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: false,
		unique: true,
		lowercase: true,
		trim: true,
		select: false
	},
	authorization: {
		type: String,
		required: true,
		uppercase: true,
		trim: true,
		select: false
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

PublisherSchema.pre('save', async function (next) {
	if (!this.isModified('name')) return next();

	try {
		this.username = normalization(this.name);
		next();
	} catch (error) {
		return next(error as CallbackError);
	}
});

const model = mongoose.model<IPublisher>('Publisher', PublisherSchema, 'publishers')

export default model