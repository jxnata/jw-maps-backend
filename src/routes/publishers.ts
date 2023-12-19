import bcrypt from 'bcrypt';
import { Express } from 'express';
import { FilterQuery } from 'mongoose';
import { SALT_ROUNDS } from '../constants';
import { authorization } from '../helpers/authorization';
import { normalization } from '../helpers/normalization';
import authPublisher from '../middleware/authPublisher';
import authUser from '../middleware/authUser';
import Assignments from '../models/assignments';
import Publishers from '../models/publishers';
import IPublisher from '../models/publishers/types';

export default (app: Express) => {

	app.post('/publishers', authUser, async (req, res) => {
		try {
			const { name, congregation } = req.body;

			const code = authorization()

			const publisher = await new Publishers({
				name,
				congregation: req.user?.congregation || congregation,
				passcode: code
			}).save();

			res.status(201).json({ publisher: publisher._id, passcode: code });
		} catch (error) {
			res.status(500).json({ message: 'Error to create a publisher.' });
		}
	});

	app.get('/publishers', authUser, async (req, res) => {
		try {
			const { skip = 0, limit = 10, search = '' } = req.query;
			let query: FilterQuery<IPublisher> = req.isMaster ? {} : { congregation: req.user?.congregation }

			if (search) {
				query = { ...query, name: { $regex: search, $options: 'i' } };
			}

			const publishers = await Publishers.find(query).skip(Number(skip)).limit(Number(limit));

			res.json({ publishers, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list publishers.' });
		}
	});

	app.get('/publishers/all', authUser, async (req, res) => {
		try {
			let query: FilterQuery<IPublisher> = req.isMaster ? {} : { congregation: req.user?.congregation }

			if (req.query.search) {
				query = { ...query, name: { $regex: req.query.search, $options: 'i' } };
			}

			const publishers = await Publishers.find(query).sort({ name: 1 });

			res.json({ publishers });
		} catch (error) {
			res.status(500).json({ message: 'Error to list all publishers.' });
		}
	});

	app.get('/publishers/:id', authUser, async (req, res) => {
		try {
			const publisher = await Publishers.findById(req.params.id).populate('congregation');

			if (!publisher) {
				return res.status(404).json({ message: 'Publisher not found.' });
			}
			res.json({ publisher });
		} catch (error) {
			res.status(500).json({ message: 'Error to get publisher.' });
		}
	});

	app.get('/publishers/me', authPublisher, async (req, res) => {
		try {
			const publisher = await Publishers.findById(req.publisher?._id).populate('congregation');

			if (!publisher) {
				return res.status(404).json({ message: 'Publisher not found.' });
			}
			res.json({ publisher });
		} catch (error) {
			res.status(500).json({ message: 'Error to get publisher.' });
		}
	});

	app.put('/publishers/reset/:id', authUser, async (req, res) => {
		try {
			const query: FilterQuery<IPublisher> = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const code = authorization();

			const hashedPasscode = await bcrypt.hash(code, SALT_ROUNDS);

			const publisher = await Publishers
				.findOneAndUpdate(
					query,
					{ passcode: hashedPasscode },
					{ new: true }
				)

			if (!publisher) {
				return res.status(404).json({ message: 'Publisher not found.' });
			}

			res.json({ publisher: publisher._id, passcode: code });
		} catch (error) {
			res.status(500).json({ message: 'Error to reset publisher.' });
		}
	});

	app.put('/publishers/:id', authUser, async (req, res) => {
		try {

			const newUsername = req.body.name ? normalization(req.body.name) : undefined
			const query: FilterQuery<IPublisher> = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const publisher = await Publishers.findOneAndUpdate(
				query,
				{
					...req.body,
					passcode: undefined,
					username: newUsername,
					congregation: req.isMaster ? req.body.congregation : req.user?.congregation
				},
				{ new: true }
			);

			if (!publisher) {
				return res.status(404).json({ message: 'Publisher not found.' });
			}

			res.json({ publisher: publisher._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to update publisher.' });
		}
	});

	app.delete('/publishers/:id', authUser, async (req, res) => {
		try {
			const query: FilterQuery<IPublisher> = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const publisher = await Publishers.findOneAndDelete(query);

			if (!publisher) {
				return res.status(404).json({ message: 'Publisher not found.' });
			}

			await Assignments.deleteMany({ publisher: publisher._id });

			res.json({ message: 'Publisher deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete publisher.' });
		}
	});
}
