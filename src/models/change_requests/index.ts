import mongoose, { Schema } from 'mongoose'
import IChangeRequest from './types'

const ChangeRequestSchema = new Schema<IChangeRequest>({
	map: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Map',
		required: true,
	},
	address: {
		street: {
			type: String,
			required: true,
		},
		number: {
			type: String,
			required: true,
		},
		district: {
			type: String,
		},
		city: {
			type: String,
			required: true,
		},
	},
	coordinates: {
		type: [Number, Number],
		required: true,
	},
	details: {
		type: String,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
})

const model = mongoose.model<IChangeRequest>('ChangeRequest', ChangeRequestSchema, 'change_requests')

export default model
