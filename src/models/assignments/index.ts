import mongoose, { Schema } from 'mongoose';
import IAssignment from './types';

const AssignmentSchema = new Schema<IAssignment>({
	publisher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Publisher',
		required: true,
	},
	map: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Map',
		required: true,
	},
	congregation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Congregation',
		required: true,
	},
	found: {
		type: Boolean,
		required: true
	},
	details: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
})

const model = mongoose.model<IAssignment>('Assignment', AssignmentSchema, 'assignments')

export default model