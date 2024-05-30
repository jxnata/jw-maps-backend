import { Router } from "express";
import mongoose, { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Maps from "../../models/maps";
import IMap from "../../models/maps/types";

const router = Router();

router.get("/", authUser, async (req, res) => {
	try {
		const { skip = 0, limit = 10, search = "", status = "" } = req.query;

		let query: FilterQuery<IMap> = req.isMaster ? {} : { congregation: req.user?.congregation };

		if (search) {
			const isValidObjectId = mongoose.Types.ObjectId.isValid(search as string);
			const cityQueries = isValidObjectId ? [{ city: search }] : [];
			const regexQueries = [
				{ name: { $regex: search, $options: "i" } },
				{ address: { $regex: search, $options: "i" } },
			];

			query = {
				...query,
				$or: [...cityQueries, ...regexQueries],
			};
		}

		if (status === "assigned") {
			query.assigned = true;
		} else if (status === "unassigned") {
			query.assigned = { $in: [false, null] };
		}

		const withQuery = await Maps.find(query)
			.select("_id")
			.skip(Number(skip))
			.limit(Number(limit))
			.sort({ updated_at: 1 });

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

		res.json({ maps: populatedMaps, skip, limit });
	} catch (error) {
		res.status(500).json({ message: "Failed to list maps due to an internal server error." });
	}
});

export default router;
