import { Router } from "express";
import authUser from "../../middleware/authUser";
import Congregations from "../../models/congregations";

const router = Router();

router.get("/view/:id", authUser, async (req, res) => {
	try {
		const congregation = await Congregations.findById(req.params.id);
		if (!congregation) {
			return res.status(404).json({ message: "Congregation not found." });
		}
		res.json({ congregation });
	} catch (error) {
		res.status(500).json({ message: "Error to get congregation." });
	}
});

export default router;
