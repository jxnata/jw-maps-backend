import mongoose, { Schema } from "mongoose";
import ICongregation from "./types";

const CongregationSchema = new Schema<ICongregation>({
	name: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

const Congregations = mongoose.model<ICongregation>("Congregation", CongregationSchema, "congregations");

export default Congregations;
