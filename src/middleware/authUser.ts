import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../constants';
import IUser from '../models/users/types';
import master from './master';

const authUser = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.header('Authorization');

		if (!authHeader) {
			return res.status(401).json({ message: 'Authorization header missing.' });
		}

		const tokenParts = authHeader.split(' ');

		if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
			master(req, res, next);
			return;
		}

		const token = tokenParts[1];

		jwt.verify(token, SECRET_KEY, (err, callback) => {
			if (err) {
				return res.status(403).json({ message: 'Invalid authentication token.' });
			}

			if (typeof callback !== 'string') {
				(req as Request & { user?: IUser }).user = callback?.user as IUser;
			}

			next();
		});
	} catch (error) {
		return res.status(500).json({ error: 'Server error', data: error })
	}
}

export default authUser