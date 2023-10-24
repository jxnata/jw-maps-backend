import { Express } from 'express';
import auth from '../middleware/auth';
import master from '../middleware/master';
import Users from '../models/users';

export default (app: Express) => {
	app.get('/users', master, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			const users = await Users.find().skip(Number(skip)).limit(Number(limit));

			res.json({ users, skip, limit });
		} catch (error) {
			return res.status(400).json({ message: 'An error occurred while listing users.' })
		}
	})

	app.post('/users', master, async (req, res) => {
		try {
			const { username } = req.body;

			const existingUser = await Users.findOne({ username });

			if (existingUser) {
				return res.status(400).json({ message: 'This username already exists.' });
			}

			const user = await new Users(req.body).save()

			res.status(201).json({ user: user._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to create user.' });
		}
	});

	app.put('/users', master, async (req, res) => {
		try {
			const user = await Users.findByIdAndUpdate(
				req.params.id,
				req.body,
				{ new: true }
			);

			if (!user) {
				return res.status(404).json({ message: 'User not found.' });
			}

			res.status(201).json({ user: user._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to create user.' });
		}
	});

	app.get('/users/:id', auth, async (req, res) => {
		try {
			const user = await Users.findById(req.params.id).populate('congregation')

			if (!user) {
				return res.status(404).json({ message: 'User not found.' });
			}

			return res.json({ user })

		} catch (error) {
			return res.status(400).json({ message: 'An error occurred while fetching the user.' })
		}
	})

	app.delete('/users/:id', master, async (req, res) => {
		try {
			const user = await Users.findByIdAndDelete(req.params.id);

			if (!user) {
				return res.status(404).json({ message: 'User not found.' });
			}

			res.json({ message: 'User deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete user.' });
		}
	});

}
