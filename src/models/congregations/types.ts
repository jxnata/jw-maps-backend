import { Document } from "mongoose";

export default interface ICongregation extends Document {
	name: string;
	created_at: Date;
}
