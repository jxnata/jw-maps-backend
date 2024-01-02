import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Maps from "../../models/maps";
import IMap from "../../models/maps/types";

const router = Router();

router.put("/:id", authUser, async (req, res) => {
	try {
		const query: FilterQuery<IMap> = req.isMaster
			? { _id: req.params.id }
			: { _id: req.params.id, congregation: req.user?.congregation };

		const map = await Maps.findOneAndUpdate(
			query,
			{
				...req.body,
				congregation: req.isMaster ? req.body.congregation : req.user?.congregation,
			},
			{ new: true }
		);

		if (!map) {
			return res.status(404).json({ message: "Map not found." });
		}

		res.json({ map: map._id });
	} catch (error) {
		res.status(500).json({ message: "Error to update map." });
	}
});

export default router;
