import mongoose, { Document } from 'mongoose';

export default interface IChangeRequest extends Document {
    map: mongoose.Types.ObjectId
    address: string
    city: mongoose.Types.ObjectId
    details: string
    coordinates: [number, number]
    created_at: Date
}