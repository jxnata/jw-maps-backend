import mongoose, { Document } from "mongoose";

export default interface IUser extends Document {
	name: string;
	username: string;
	password: string;
	address: string;
	private_key: string;
	congregation: mongoose.Types.ObjectId;
	publisher?: mongoose.Types.ObjectId;
	created_at: Date;
}
