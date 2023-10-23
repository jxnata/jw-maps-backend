import { Express } from 'express';
import { normalization } from '../helpers/normalization';
import auth from '../middleware/auth';
import Maps from '../models/maps';

export default (app: Express) => {

	app.post('/maps', auth, async (req, res) => {
		try {
			const { congregation } = req.body;

			const map = await new Maps({
				...req.body,
				congregation: req.user?.congregation || congregation,
			}).save();

			res.status(201).json({ map: map._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to create a map.' });
		}
	});

	app.get('/maps', auth, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;
			const query = req.isMaster ? {} : { congregation: req.user?.congregation }

			const maps = await Maps.find(query).populate('last_visited_by').skip(Number(skip)).limit(Number(limit));

			res.json({ maps, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list maps.' });
		}
	});

	app.get('/maps/:id', async (req, res) => {
		try {
			const map = await Maps.findById(req.params.id).populate('last_visited_by');

			if (!map) {
				return res.status(404).json({ message: 'Map not found.' });
			}
			res.json({ map });
		} catch (error) {
			res.status(500).json({ message: 'Error to get map.' });
		}
	});

	app.put('/maps/:id', auth, async (req, res) => {
		try {

			const newUsername = req.body.name ? normalization(req.body.name) : undefined
			const query = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const map = await Maps.findOneAndUpdate(
				query,
				{
					...req.body,
					authorization: undefined,
					username: newUsername,
					congregation: req.isMaster ? req.body.congregation : req.user?.congregation
				},
				{ new: true }
			);

			if (!map) {
				return res.status(404).json({ message: 'Map not found.' });
			}

			res.json({ map: map._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to update map.' });
		}
	});

	app.delete('/maps/:id', auth, async (req, res) => {
		try {
			const query = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const map = await Maps.findOneAndDelete(query);

			if (!map) {
				return res.status(404).json({ message: 'Map not found.' });
			}

			res.json({ message: 'Map deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete map.' });
		}
	});
}
