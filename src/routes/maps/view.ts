import { Router } from "express";
import Maps from "../../models/maps";

const router = Router();

router.get("/view/:id", async (req, res) => {
	try {
		const map = await Maps.findById(req.params.id).populate(["city", "last_visited_by"]);

		if (!map) {
			return res.status(404).json({ message: "Map not found." });
		}

		res.json({ map });
	} catch (error) {
		res.status(500).json({ message: "Error to get map." });
	}
});

export default router;
