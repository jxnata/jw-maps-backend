import { Router } from "express";
import authUser from "../../middleware/authUser";
import Maps from "../../models/maps";

const router = Router();

router.post("/", authUser, async (req, res) => {
	try {
		const { congregation } = req.body;

		const map = await new Maps({
			...req.body,
			congregation: req.user?.congregation || congregation,
		}).save();

		res.status(201).json({ map: map._id });
	} catch (error) {
		res.status(500).json({ message: "Error to create a map." });
	}
});

export default router;
