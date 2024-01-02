import mongoose, { Schema } from "mongoose";
import IChangeRequest from "./types";

const ChangeRequestSchema = new Schema<IChangeRequest>({
	map: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Map",
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	city: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "City",
		required: true,
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
});

const ChangeRequests = mongoose.model<IChangeRequest>("ChangeRequest", ChangeRequestSchema, "change_requests");

export default ChangeRequests;
