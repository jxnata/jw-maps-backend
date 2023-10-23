import mongoose, { Document } from 'mongoose';

export default interface IChangeRequest extends Document {
    map: mongoose.Types.ObjectId
    address: {
        street: string,
        number: string,
        district: string,
        city: string,
    }
    details: string
    coordinates: [number, number]
    created_at: Date
}