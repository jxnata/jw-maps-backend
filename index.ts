import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import mongoose from 'mongoose'
import cron from './src/jobs'
import routes from './src/routes'

dotenv.config()

const app: Express = express()
const server = require('http').createServer(app)

const run = async () => {
	await mongoose.connect(process.env.DATABASE_URL!)

	app.use(cors())
	app.use(express.urlencoded({ limit: '4mb', extended: true }))
	app.use(express.json())
	app.use(routes)
	app.use(express.static('public'));

	cron.start()

	server.listen(process.env.PORT || 3000, () => {
		console.log(`Server running on port ${process.env.PORT}`)
	})
}

run()

module.exports = app;