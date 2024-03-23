import { Router } from "express";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import Maps from "../../models/maps";
import { sendNotification } from "../../services/onesignal/send-notification";

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

		const map = await Maps.findById(req.body.map).populate("city");

		if (map) {
			if (map.city && typeof map.city === "object" && "name" in map.city) {
				await sendNotification(req.body.publisher, {
					title: "Você recebeu uma designação",
					content: `${map.city.name} - ${map.name} \n${map.address}`,
				});
			}
		}

		res.status(201).json({ assignment: assignment._id });
	} catch (error) {
		res.status(500).json({ message: "Error to create a assignment." });
	}
});

export default router;
