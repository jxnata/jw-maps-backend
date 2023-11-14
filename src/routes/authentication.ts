import bcrypt from 'bcrypt'
import { Express } from 'express'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../constants'
import { normalization } from '../helpers/normalization'
import Publishers from '../models/publishers'
import Users from '../models/users'

export default (app: Express) => {
	app.post('/auth/users', async (req, res) => {
		try {
			const { username, password } = req.body;

			const user = await Users.findOne({ username }).select('+password').populate('congregation');

			if (!user) {
				return res.status(400).json({ message: 'User not found.' });
			}

			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) {
				return res.status(400).json({ message: 'Wrong username or password.' });
			}

			const userWithoutPassword = { ...user.toObject(), password: undefined };

			const token = jwt.sign({ user: userWithoutPassword }, SECRET_KEY);

			res.json({ user: userWithoutPassword, token });
		} catch (error) {
			res.status(500).json({ message: 'Error to authenticate user' });
		}
	});

	app.post('/auth/publishers', async (req, res) => {
		try {
			const { username, passcode } = req.body;

			const publisher = await Publishers.findOne({ username: normalization(username) }).select('+passcode').populate('congregation');

			if (!publisher) {
				return res.status(400).json({ message: 'Publisher not found.' });
			}

			const passwordMatch = await bcrypt.compare(passcode, publisher.passcode);

			if (!passwordMatch) {
				return res.status(400).json({ message: 'Wrong username or passcode.' });
			}

			const publisherWithoutPassword = { ...publisher.toObject(), passcode: undefined };

			const token = jwt.sign({ publisher: publisherWithoutPassword }, SECRET_KEY);

			res.json({ publisher: publisherWithoutPassword, token });

		} catch (error) {
			res.status(500).json({ message: 'Error to authenticate user' });
		}
	});
}
