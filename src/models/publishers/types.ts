import mongoose, { Document } from 'mongoose'

export default interface IPublisher extends Document {
    name: string
    congregation: mongoose.Types.ObjectId
    created_at: Date
}