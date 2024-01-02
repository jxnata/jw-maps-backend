import mongoose, { Document } from "mongoose";

export default interface IMap extends Document {
	name: string;
	address: string;
	city: mongoose.Types.ObjectId;
	coordinates: [number, number];
	congregation: mongoose.Types.ObjectId;
	last_visited: Date;
	last_visited_by: mongoose.Types.ObjectId;
	created_at: Date;
}
