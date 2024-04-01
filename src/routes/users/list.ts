import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Users from "../../models/users";
import IUser from "../../models/users/types";

const router = Router();

router.get("/", authUser, async (req, res) => {
	try {
		const { skip = 0, limit = 10 } = req.query;

		let query: FilterQuery<IUser> = req.isMaster ? {} : { congregation: req.user?.congregation };

		const users = await Users.find(query).skip(Number(skip)).limit(Number(limit));

		res.json({ users, skip, limit });
	} catch (error) {
		return res.status(400).json({ message: "An error occurred while listing users." });
	}
});

export default router;
