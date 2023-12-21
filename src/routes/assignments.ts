import { Express } from 'express';
import { FilterQuery } from 'mongoose';
import authPublisher from '../middleware/authPublisher';
import authUser from '../middleware/authUser';
import Assignments from '../models/assignments';
import IAssignment from '../models/assignments/types';
import Maps from '../models/maps';

export default (app: Express) => {

	app.post('/assignments', authUser, async (req, res) => {
		try {
			const { congregation } = req.body;

			const assignment = await new Assignments({
				...req.body,
				congregation: req.user?.congregation || congregation,
			}).save();

			res.status(201).json({ assignment: assignment._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to create a assignment.' });
		}
	});

	app.get('/assignments', authUser, async (req, res) => {
		try {
			const { skip = 0, limit = 10, search = '' } = req.query;

			let query: FilterQuery<IAssignment> = req.isMaster ? {} : { congregation: req.user?.congregation }

			if (search) {
				query = {
					...query,
					$or: [
						{ 'publisher.name': { $regex: search, $options: 'i' } },
						{ 'map.address': { $regex: search, $options: 'i' } },
						{ 'city.name': { $regex: search, $options: 'i' } }
					]
				};
			}

			const assignments = await Assignments
				.find(query)
				.populate(['publisher', {
					path: 'map',
					populate: {
						path: 'city',
						model: 'City',
						select: 'name'
					}
				}])
				.skip(Number(skip))
				.limit(Number(limit));

			res.json({ assignments, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list assignments.' });
		}
	});

	app.get('/assignments/my', authPublisher, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			const assignments = await Assignments
				.find({ publisher: req.publisher?._id, finished: false })
				.populate({
					path: 'map',
					populate: {
						path: 'city',
						model: 'City',
						select: 'name'
					}
				})
				.skip(Number(skip))
				.limit(Number(limit));

			res.json({ assignments, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list assignments.' });
		}
	});

	app.get('/assignments/map/:id', authUser, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			const assignments = await Assignments
				.find({ map: req.params.id, finished: false })
				.populate({
					path: 'map',
					populate: {
						path: 'city',
						model: 'City',
						select: 'name'
					}
				})
				.skip(Number(skip))
				.limit(Number(limit));

			res.json({ assignments, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list assignments.' });
		}
	});

	app.get('/assignments/my/history', authPublisher, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			const assignments = await Assignments
				.find({ publisher: req.publisher?._id, finished: true })
				.populate({
					path: 'map',
					populate: {
						path: 'city',
						model: 'City',
						select: 'name'
					}
				})
				.skip(Number(skip))
				.limit(Number(limit));

			res.json({ assignments, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list assignments.' });
		}
	});

	app.get('/assignments/:id', async (req, res) => {
		try {
			const assignment = await Assignments
				.findById(req.params.id)
				.populate(['publisher', {
					path: 'map',
					populate: {
						path: 'city',
						model: 'City',
						select: 'name'
					}
				}]);

			if (!assignment) {
				return res.status(404).json({ message: 'Assignment not found.' });
			}
			res.json({ assignment });
		} catch (error) {
			res.status(500).json({ message: 'Error to get assignment.' });
		}
	});

	app.put('/assignments/:id/finish', authPublisher, async (req, res) => {
		try {

			const assignment = await Assignments.findOneAndUpdate(
				{ _id: req.params.id, publisher: req.publisher?._id, finished: false },
				{
					found: req.body.found,
					details: req.body.details,
					finished: true
				},
				{ new: true }
			);

			if (!assignment) {
				return res.status(404).json({ message: 'Assignment not found.' });
			}

			await Maps.findByIdAndUpdate(assignment?.map, {
				last_visited: Date.now(),
				last_visited_by: assignment?.publisher
			});

			res.json({ assignment: assignment._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to update assignment.' });
		}
	});

	app.put('/assignments/:id', authUser, async (req, res) => {
		try {
			const query: FilterQuery<IAssignment> = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const assignment = await Assignments.findOneAndUpdate(
				query,
				{
					...req.body,
					congregation: req.isMaster ? req.body.congregation : req.user?.congregation
				},
				{ new: true }
			);

			if (!assignment) {
				return res.status(404).json({ message: 'Assignment not found.' });
			}

			res.json({ assignment: assignment._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to update assignment.' });
		}
	});

	app.delete('/assignments/:id', authUser, async (req, res) => {
		try {
			const query: FilterQuery<IAssignment> = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const assignment = await Assignments.findOneAndDelete(query);

			if (!assignment) {
				return res.status(404).json({ message: 'Assignment not found.' });
			}

			res.json({ message: 'Assignment deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete assignment.' });
		}
	});
}
