import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import Users from "../models/users";
import IUser from "../models/users/types";
import master from "./master";

const authUser = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.header("Authorization");

		if (!authHeader) {
			return res.status(401).json({ message: "Authorization header missing." });
		}

		const tokenParts = authHeader.split(" ");

		if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
			master(req, res, next);
			return;
		}

		const token = tokenParts[1];

		jwt.verify(token, SECRET_KEY, async (err, callback) => {
			if (err) {
				return res.status(403).json({ message: "Invalid authentication token." });
			}

			if (typeof callback !== "string") {
				const user_id = callback?.user?._id as IUser;
				const user = await Users.findById(user_id).populate(["congregation", "publisher"]);

				if (!user) {
					return res.status(403).json({ message: "User requested not found." });
				}

				(req as Request & { user?: IUser }).user = user;

				if (!req.user?.congregation) {
					return res.status(403).json({ message: "Invalid user." });
				}
			}

			req.isMaster = false;

			next();
		});
	} catch (error) {
		return res.status(500).json({ error: "Server error", data: error });
	}
};

export default authUser;
