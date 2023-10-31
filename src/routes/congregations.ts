import { Express } from 'express';
import authUser from '../middleware/authUser';
import master from '../middleware/master';
import Congregations from '../models/congregations';

export default (app: Express) => {

	app.post('/congregations', master, async (req, res) => {
		try {
			const { name } = req.body;

			const congregation = await new Congregations({ name }).save();

			res.status(201).json({ congregation: congregation._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to create a congregation.' });
		}
	});

	app.get('/congregations', master, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			const congregations = await Congregations.find().skip(Number(skip)).limit(Number(limit));

			res.json({ congregations, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list congregations.' });
		}
	});

	app.get('/congregations/:id', authUser, async (req, res) => {
		try {
			const congregation = await Congregations.findById(req.params.id);
			if (!congregation) {
				return res.status(404).json({ message: 'Congregation not found.' });
			}
			res.json({ congregation });
		} catch (error) {
			res.status(500).json({ message: 'Error to get congregation.' });
		}
	});

	app.put('/congregations/:id', master, async (req, res) => {
		try {
			const congregation = await Congregations.findByIdAndUpdate(
				req.params.id,
				req.body,
				{ new: true }
			);

			if (!congregation) {
				return res.status(404).json({ message: 'Congregation not found.' });
			}

			res.json({ congregation: congregation._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to update congregation.' });
		}
	});

	app.delete('/congregations/:id', master, async (req, res) => {
		try {
			const congregation = await Congregations.findByIdAndDelete(req.params.id);

			if (!congregation) {
				return res.status(404).json({ message: 'Congregation not found.' });
			}

			res.json({ message: 'Congregation deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete congregation.' });
		}
	});
}
