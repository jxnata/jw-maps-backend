import { Express } from 'express';
import { authorization } from '../helpers/authorization';
import { normalization } from '../helpers/normalization';
import auth from '../middleware/auth';
import Publishers from '../models/publishers';

export default (app: Express) => {

	app.post('/publishers', auth, async (req, res) => {
		try {
			const { name, congregation } = req.body;

			const code = authorization()

			const publisher = await new Publishers({ name, congregation, authorization: code }).save();

			res.status(201).json({ publisher: publisher._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to create a publisher.' });
		}
	});

	app.get('/publishers', auth, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			const publishers = await Publishers.find().select('+authorization').skip(Number(skip)).limit(Number(limit));

			res.json({ publishers, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list publishers.' });
		}
	});

	app.get('/publishers/:id', auth, async (req, res) => {
		try {
			const publisher = await Publishers.findById(req.params.id).select('+authorization').populate('congregation');

			if (!publisher) {
				return res.status(404).json({ message: 'Publisher not found.' });
			}
			res.json({ publisher });
		} catch (error) {
			res.status(500).json({ message: 'Error to get publisher.' });
		}
	});

	app.post('/publishers/auth', async (req, res) => {
		try {
			const publisher = await Publishers.findOne({
				username: normalization(req.body.name),
				authorization: req.body.authorization
			})
				.populate('congregation');

			if (!publisher) {
				return res.status(404).json({ message: 'Invalid name or authorization code.' });
			}
			res.json({ publisher });
		} catch (error) {
			res.status(500).json({ message: 'Error to get publisher.' });
		}
	});

	app.put('/publishers/reset/:id', auth, async (req, res) => {
		try {
			const code = authorization();

			const publisher = await Publishers
				.findByIdAndUpdate(
					req.params.id,
					{ authorization: code },
					{ new: true }
				)
				.select('+authorization');

			if (!publisher) {
				return res.status(404).json({ message: 'Publisher not found.' });
			}

			res.json({ publisher: publisher });
		} catch (error) {
			res.status(500).json({ message: 'Error to reset publisher.' });
		}
	});

	app.put('/publishers/:id', auth, async (req, res) => {
		try {

			const newUsername = req.body.name ? normalization(req.body.name) : undefined

			const publisher = await Publishers.findByIdAndUpdate(
				req.params.id,
				{ ...req.body, authorization: undefined, username: newUsername },
				{ new: true }
			);

			if (!publisher) {
				return res.status(404).json({ message: 'Publisher not found.' });
			}

			res.json({ publisher: publisher._id });
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Error to update publisher.' });
		}
	});

	app.delete('/publishers/:id', auth, async (req, res) => {
		try {
			const publisher = await Publishers.findByIdAndDelete(req.params.id);

			if (!publisher) {
				return res.status(404).json({ message: 'Publishers not found.' });
			}

			res.json({ message: 'Publisher deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete publisher.' });
		}
	});
}
