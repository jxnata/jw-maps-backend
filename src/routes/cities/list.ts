import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Cities from "../../models/cities";
import ICity from "../../models/cities/types";

const router = Router();

router.get("/", authUser, async (req, res) => {
	try {
		const { skip = 0, limit = 10, search = "" } = req.query;

		let query: FilterQuery<ICity> = req.isMaster ? {} : { congregation: req.user?.congregation };

		if (search) {
			query = { ...query, name: { $regex: search, $options: "i" } };
		}

		const withQuery = await Cities.find(query).select("_id");

		const cities = await Cities.aggregate([
			{
				$match: { _id: { $in: withQuery.map(city => city._id) } },
			},
			{
				$lookup: {
					from: "maps",
					localField: "_id",
					foreignField: "city",
					as: "maps",
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					congregation: 1,
					created_at: 1,
					maps_count: { $size: "$maps" },
				},
			},
		]);

		res.json({ cities, skip, limit });
	} catch (error) {
		res.status(500).json({ message: "Error to list cities." });
	}
});

export default router;
