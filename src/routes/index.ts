import { Express } from 'express'
import auth from './auth'
import congregations from './congregations'
import users from './users'

const routes = (app: Express) => {
    auth(app)
    congregations(app)
    users(app)
}

export default routes