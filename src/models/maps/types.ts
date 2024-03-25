import mongoose, { Document } from "mongoose";
import ICity from "../cities/types";

export default interface IMap extends Document {
	name: string;
	address: string;
	details?: string;
	city: mongoose.Types.ObjectId | ICity;
	coordinates: [number, number];
	congregation: mongoose.Types.ObjectId;
	assigned: boolean;
	last_visited: Date;
	last_visited_by: mongoose.Types.ObjectId;
	created_at: Date;
	updated_at: Number;
}
