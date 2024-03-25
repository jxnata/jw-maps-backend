import { Router } from "express";
import authPublisher from "../../middleware/authPublisher";
import Assignments from "../../models/assignments";

const router = Router();

router.get("/my", authPublisher, async (req, res) => {
	try {
		const { skip = 0, limit = 10 } = req.query;

		const assignments = await Assignments.find({ publisher: req.publisher?._id, finished: false }).populate({
			path: "map",
			populate: {
				path: "city",
				model: "City",
				select: "name",
			},
		});

		res.json({ assignments, skip, limit });
	} catch (error) {
		res.status(500).json({ message: "Error to list assignments." });
	}
});

export default router;
