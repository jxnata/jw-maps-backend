import { Router } from "express";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";

const router = Router();

router.post("/", authUser, async (req, res) => {
	try {
		const { congregation } = req.body;

		const exists = await Assignments.findOne({ map: req.body.map, finished: false, congregation });

		if (exists) {
			return res.status(400).json({ message: "Map already assigned." });
		}

		const assignment = await new Assignments({
			...req.body,
			congregation: req.user?.congregation || congregation,
		}).save();

		res.status(201).json({ assignment: assignment._id });
	} catch (error) {
		res.status(500).json({ message: "Error to create a assignment." });
	}
});

export default router;
