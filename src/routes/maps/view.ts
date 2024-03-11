import { Router } from "express";
import Assignments from "../../models/assignments";
import Maps from "../../models/maps";

const router = Router();

router.get("/view/:id", async (req, res) => {
	try {
		const map = await Maps.findById(req.params.id).populate(["city", "last_visited_by"]);

		if (!map) {
			return res.status(404).json({ message: "Map not found." });
		}

		const last_assignments = await Assignments.find({ map: map._id }).sort({ created_at: -1 }).limit(1)
		let last_assignment = undefined

		if (last_assignments.length) {
			last_assignment = last_assignments[0]
		}

		res.json({ map: { ...map.toObject(), last_assignment } });
	} catch (error) {
		res.status(500).json({ message: "Error to get map." });
	}
});

export default router;
