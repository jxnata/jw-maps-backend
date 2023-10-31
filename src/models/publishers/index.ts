import bcrypt from 'bcrypt';
import mongoose, { CallbackError, Schema } from 'mongoose';
import { SALT_ROUNDS } from '../../constants';
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
	passcode: {
		type: String,
		required: true,
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

PublisherSchema.pre<IPublisher>('save', async function (next) {
	try {
		if (this.isModified('name')) {
			this.username = normalization(this.name);
		}

		if (this.isModified('passcode')) {
			const hashedPasscode = await bcrypt.hash(this.passcode, SALT_ROUNDS);
			this.passcode = hashedPasscode;
		}

		next();
	} catch (error) {
		return next(error as CallbackError);
	}
});

const model = mongoose.model<IPublisher>('Publisher', PublisherSchema, 'publishers')

export default model