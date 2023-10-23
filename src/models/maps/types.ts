import mongoose, { Document } from 'mongoose';

export default interface IMap extends Document {
    name: string
    address: {
        street: string,
        number: string,
        district: string,
        city: string,
    }
    coordinates: [number, number];
    congregation: mongoose.Types.ObjectId
    last_visited: Date
    created_at: Date
}