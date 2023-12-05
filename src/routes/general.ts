import { Express } from 'express'
import authUser from '../middleware/authUser'
import Assignments from '../models/assignments'
import Maps from '../models/maps'
import Publishers from '../models/publishers'

export default (app: Express) => {
	app.get('/general/resume', authUser, async (req, res) => {
		try {
			const query = req.isMaster ? {} : { congregation: req.user?.congregation };

			const publishers = await Publishers.count(query);
			const maps = await Maps.count(query);
			const assignments = await Assignments.count(query);

			res.json({ publishers, maps, assignments });
		} catch (error) {
			res.status(500).json({ message: 'Error to authenticate user' });
		}
	});
}
