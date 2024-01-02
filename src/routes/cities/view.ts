import { Router } from "express";
import authUser from "../../middleware/authUser";
import Cities from "../../models/cities";

const router = Router();

router.get("/view/:id", authUser, async (req, res) => {
	try {
		const city = await Cities.findById(req.params.id);
		if (!city) {
			return res.status(404).json({ message: "City not found." });
		}
		res.json({ city });
	} catch (error) {
		res.status(500).json({ message: "Error to get city." });
	}
});

export default router;
