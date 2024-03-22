import { Router } from "express";
import master from "../../middleware/master";
import Maps from "../../models/maps";

const router = Router();

router.post("/add-updated_at", master, async (req, res) => {
	try {
		const maps = await Maps.find({});

		for (const map of maps) {
			if (map.last_visited) {
				map.updated_at = map.last_visited.getTime();
			} else {
				map.updated_at = map.created_at.getTime();
			}
			await map.save();
		}

		res.status(200).json({ message: "Script success" });
	} catch (error) {
		res.status(500).json({ message: "Script error." });
	}
});

export default router;
