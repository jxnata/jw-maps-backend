import { Router } from "express";
import master from "../../middleware/master";
import Congregations from "../../models/congregations";
const router = Router();

router.get("/", master, async (req, res) => {
	try {
		const { skip = 0, limit = 10 } = req.query;

		const congregations = await Congregations.find().skip(Number(skip)).limit(Number(limit));

		res.json({ congregations, skip, limit });
	} catch (error) {
		res.status(500).json({ message: "Error to list congregations." });
	}
});

export default router;
