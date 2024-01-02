import { Router } from "express";
import master from "../../middleware/master";
import Congregations from "../../models/congregations";

const router = Router();

router.put("/:id", master, async (req, res) => {
	try {
		const congregation = await Congregations.findByIdAndUpdate(req.params.id, req.body, { new: true });

		if (!congregation) {
			return res.status(404).json({ message: "Congregation not found." });
		}

		res.json({ congregation: congregation._id });
	} catch (error) {
		res.status(500).json({ message: "Error to update congregation." });
	}
});

export default router;
