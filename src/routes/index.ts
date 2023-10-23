import { Express } from 'express'
import auth from './authentication'
import congregations from './congregations'
import maps from './maps'
import publishers from './publishers'
import users from './users'

const routes = (app: Express) => {
    auth(app)
    congregations(app)
    maps(app)
    publishers(app)
    users(app)
}

export default routes