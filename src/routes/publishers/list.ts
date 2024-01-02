import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Publishers from "../../models/publishers";
import IPublisher from "../../models/publishers/types";

const router = Router();

router.get("/", authUser, async (req, res) => {
	try {
		const { skip = 0, limit = 10, search = "" } = req.query;
		let query: FilterQuery<IPublisher> = req.isMaster ? {} : { congregation: req.user?.congregation };

		if (search) {
			query = { ...query, name: { $regex: search, $options: "i" } };
		}

		const publishers = await Publishers.find(query).skip(Number(skip)).limit(Number(limit));

		res.json({ publishers, skip, limit });
	} catch (error) {
		res.status(500).json({ message: "Error to list publishers." });
	}
});

export default router;
