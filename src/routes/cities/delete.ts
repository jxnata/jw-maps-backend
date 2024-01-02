import { Router } from "express";
import authUser from "../../middleware/authUser";
import Cities from "../../models/cities";
import Maps from "../../models/maps";

const router = Router();

router.delete("/:id", authUser, async (req, res) => {
	try {
		const city = await Cities.findByIdAndDelete(req.params.id);

		if (!city) {
			return res.status(404).json({ message: "City not found." });
		}

		await Maps.deleteMany({ city: city._id });

		res.json({ message: "City deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error to delete city." });
	}
});

export default router;
