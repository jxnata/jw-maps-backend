import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import Maps from "../../models/maps";
import IMap from "../../models/maps/types";

const router = Router();

router.delete("/:id", authUser, async (req, res) => {
	try {
		const query: FilterQuery<IMap> = req.isMaster
			? { _id: req.params.id }
			: { _id: req.params.id, congregation: req.user?.congregation };

		const map = await Maps.findOneAndDelete(query);

		if (!map) {
			return res.status(404).json({ message: "Map not found." });
		}

		await Assignments.deleteMany({ map: map._id });

		res.json({ message: "Map deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error to delete map." });
	}
});

export default router;
