import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Maps from "../../models/maps";
import IMap from "../../models/maps/types";

const router = Router();

router.get("/all", authUser, async (req, res) => {
	try {
		let query: FilterQuery<IMap> = req.isMaster ? {} : { congregation: req.user?.congregation };

		const withQuery = await Maps.find(query).select("_id");

		const maps = await Maps.aggregate([
			{
				$match: { _id: { $in: withQuery.map(map => map._id) } },
			},
			{
				$lookup: {
					from: "assignments",
					localField: "_id",
					foreignField: "map",
					as: "last_assignment",
					pipeline: [{ $sort: { created_at: -1 } }, { $limit: 1 }],
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					address: 1,
					district: 1,
					details: 1,
					city: 1,
					coordinates: 1,
					congregation: 1,
					assigned: 1,
					last_visited: 1,
					last_visited_by: 1,
					created_at: 1,
					updated_at: 1,
					last_assignment: { $ifNull: [{ $arrayElemAt: ["$last_assignment._id", 0] }, null] },
				},
			},
		]);

		const populatedMaps = await Maps.populate(maps, [
			{ path: "city", model: "City" },
			{ path: "last_visited_by", model: "Publisher" },
			{ path: "last_assignment", model: "Assignment" },
		]);

		res.json({ maps: populatedMaps });
	} catch (error) {
		res.status(500).json({ message: "Error to list maps." });
	}
});

export default router;
