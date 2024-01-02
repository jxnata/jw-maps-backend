import mongoose, { Document } from "mongoose";

export default interface IPublisher extends Document {
	name: string;
	username: string;
	passcode: string;
	privileges: string[];
	congregation: mongoose.Types.ObjectId;
	created_at: Date;
}
