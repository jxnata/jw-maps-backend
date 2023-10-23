import dotenv from 'dotenv'

dotenv.config()

export const SECRET_KEY = `${process.env.SECRET_KEY}`
export const MASTER_SECRET = `${process.env.MASTER_SECRET}`