import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import IAssignment from "../../models/assignments/types";

const router = Router();

router.get("/", authUser, async (req, res) => {
	try {
		const { skip = 0, limit = 10, search = "" } = req.query;

		let query: FilterQuery<IAssignment> = req.isMaster ? {} : { congregation: req.user?.congregation };

		if (search) {
			query = {
				...query,
				finished: false,
				$or: [
					{ publisher: { $elemMatch: { name: { $regex: search, $options: "i" } } } },
					{ map: { $elemMatch: { address: { $regex: search, $options: "i" } } } },
					{ city: { $elemMatch: { name: { $regex: search, $options: "i" } } } },
				],
			};
		}

		const assignments = await Assignments.find(query)
			.populate([
				"publisher",
				{
					path: "map",
					populate: {
						path: "city",
						model: "City",
						select: "name",
					},
				},
			])
			.skip(Number(skip))
			.limit(Number(limit));

		res.json({ assignments, skip, limit });
	} catch (error) {
		res.status(500).json({ message: "Error to list assignments." });
	}
});

export default router;
