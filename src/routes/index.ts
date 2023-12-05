import { Express } from 'express'
import assignments from './assignments'
import auth from './authentication'
import cities from './cities'
import congregations from './congregations'
import general from './general'
import maps from './maps'
import publishers from './publishers'
import users from './users'

const routes = (app: Express) => {
    auth(app)
    assignments(app)
    cities(app)
    congregations(app)
    maps(app)
    publishers(app)
    users(app)
    general(app)
}

export default routes