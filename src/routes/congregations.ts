import { Express } from 'express';
import Congregation from '../models/congregations';

export default (app: Express) => {

	app.post('/congregations', async (req, res) => {
		try {
			const { name } = req.body;

			const congregation = await new Congregation({ name }).save();

			res.status(201).json({ congregation: congregation._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to create a congregation.' });
		}
	});

	app.get('/congregations', async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			const congregations = await Congregation.find().skip(Number(skip)).limit(Number(limit));

			res.json({ congregations, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list congregations.' });
		}
	});

	app.get('/congregations/:id', async (req, res) => {
		try {
			const congregation = await Congregation.findById(req.params.id);
			if (!congregation) {
				return res.status(404).json({ message: 'Congregation not found.' });
			}
			res.json(congregation);
		} catch (error) {
			res.status(500).json({ message: 'Error to get congregation.' });
		}
	});

	app.put('/congregations/:id', async (req, res) => {
		try {
			const congregation = await Congregation.findByIdAndUpdate(
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

	app.delete('/congregations/:id', async (req, res) => {
		try {
			const congregation = await Congregation.findByIdAndDelete(req.params.id);

			if (!congregation) {
				return res.status(404).json({ message: 'Congregation not found.' });
			}

			res.json({ message: 'Congregation deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete congregation.' });
		}
	});
}
