import { Router } from "express";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";

const router = Router();

router.get("/publisher/:id", authUser, async (req, res) => {
	try {
		const { skip = 0, limit = 10 } = req.query;

		const assignments = await Assignments.find({ publisher: req.params.id, finished: false })
			.skip(Number(skip))
			.limit(Number(limit));

		res.json({ assignments, skip, limit });
	} catch (error) {
		res.status(500).json({ message: "Error to list assignments." });
	}
});

export default router;
