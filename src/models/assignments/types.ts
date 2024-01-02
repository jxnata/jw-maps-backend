import mongoose, { Document } from "mongoose";

export default interface IAssignment extends Document {
	publisher: mongoose.Types.ObjectId;
	map: mongoose.Types.ObjectId;
	congregation: mongoose.Types.ObjectId;
	details: string;
	found: boolean;
	finished: boolean;
	permanent: boolean;
	created_at: Date;
}
