import bcrypt from 'bcrypt'
import { Express } from 'express'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../constants'
import Users from '../models/users'

export default (app: Express) => {
	app.post('/auth', async (req, res) => {
		try {
			const { username, password } = req.body;

			const user = await Users.findOne({ username }).select('+password');

			if (!user) {
				return res.status(400).json({ message: 'User not found.' });
			}

			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) {
				return res.status(400).json({ message: 'Wrong username or password.' });
			}

			const token = jwt.sign({ userId: user._id }, SECRET_KEY);

			const userWithoutPassword = { ...user.toObject(), password: undefined };

			res.json({ user: userWithoutPassword, token });
		} catch (error) {
			res.status(500).json({ message: 'Error to authenticate user' });
		}
	});
}
