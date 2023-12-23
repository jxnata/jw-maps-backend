import { Express } from 'express';
import { FilterQuery } from 'mongoose';
import authUser from '../middleware/authUser';
import Assignments from '../models/assignments';
import Maps from '../models/maps';
import IMap from '../models/maps/types';

export default (app: Express) => {

	app.post('/maps', authUser, async (req, res) => {
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

	app.get('/maps', authUser, async (req, res) => {
		try {
			const { skip = 0, limit = 10, search = '' } = req.query;

			let query: FilterQuery<IMap> = req.isMaster ? {} : { congregation: req.user?.congregation }

			if (search) {
				query = {
					...query,
					$or: [
						{ name: { $regex: search, $options: 'i' } },
						{ address: { $regex: search, $options: 'i' } }
					]
				};
			}

			const maps = await Maps.find(query).populate(['city', 'last_visited_by']).skip(Number(skip)).limit(Number(limit));

			res.json({ maps, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list maps.' });
		}
	});

	app.get('/maps/unassigned', authUser, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			let query: FilterQuery<IMap> = req.isMaster ? {} : { congregation: req.user?.congregation }

			const maps = await Maps.find({
				...query,
				_id: { $nin: await Assignments.distinct('map', { finished: false, ...query }) }
			}).populate(['city', 'last_visited_by']);

			res.json({ maps, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list maps.' });
		}
	});

	app.get('/maps/:id', async (req, res) => {
		try {
			const map = await Maps.findById(req.params.id).populate(['city', 'last_visited_by']);

			if (!map) {
				return res.status(404).json({ message: 'Map not found.' });
			}

			res.json({ map });
		} catch (error) {
			res.status(500).json({ message: 'Error to get map.' });
		}
	});

	app.put('/maps/:id', authUser, async (req, res) => {
		try {
			const query: FilterQuery<IMap> = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const map = await Maps.findOneAndUpdate(
				query,
				{
					...req.body,
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

	app.delete('/maps/:id', authUser, async (req, res) => {
		try {
			const query: FilterQuery<IMap> = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const map = await Maps.findOneAndDelete(query);

			if (!map) {
				return res.status(404).json({ message: 'Map not found.' });
			}

			await Assignments.deleteMany({ map: map._id });

			res.json({ message: 'Map deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete map.' });
		}
	});
}
