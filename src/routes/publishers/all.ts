import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Publishers from "../../models/publishers";
import IPublisher from "../../models/publishers/types";

const router = Router();

router.get("/all", authUser, async (req, res) => {
	try {
		let query: FilterQuery<IPublisher> = req.isMaster ? {} : { congregation: req.user?.congregation };

		if (req.query.search) {
			query = { ...query, name: { $regex: req.query.search, $options: "i" } };
		}

		const publishers = await Publishers.find(query).sort({ name: 1 });

		res.json({ publishers });
	} catch (error) {
		res.status(500).json({ message: "Error to list all publishers." });
	}
});

export default router;
