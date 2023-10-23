import mongoose, { Document } from 'mongoose'

export default interface IUser extends Document {
    name: string
    username: string
    password: string
    congregation: mongoose.Types.ObjectId
    created_at: Date
}