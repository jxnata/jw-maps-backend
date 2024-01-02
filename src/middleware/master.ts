import { NextFunction, Request, Response } from "express";
import { MASTER_SECRET } from "../constants";

const master = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header("Authorization");

		if (!token) {
			return res.status(401).json({ message: "Authorization header missing." });
		}

		if (token !== MASTER_SECRET) {
			return res.status(403).json({ message: "Invalid authentication token." });
		}

		req.isMaster = true;

		next();
	} catch (error) {
		return res.status(500).json({ error: "Server error", data: error });
	}
};

export default master;
