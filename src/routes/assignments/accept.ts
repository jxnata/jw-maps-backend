import { Router } from "express";
import { verifyMessage } from "viem";
import { getAssignmentMessage } from "../../helpers/get-assignment-message";
import authPublisher from "../../middleware/authPublisher";
import Assignments from "../../models/assignments";
import Maps from "../../models/maps";
import Users from "../../models/users";
import { sendNotification } from "../../services/onesignal/send-notification";

const router = Router();

router.post("/accept", authPublisher, async (req, res) => {
	try {
		if (!req.publisher) {
			return res.status(401).json({ message: "Only publishers can accept assignments." });
		}

		const exists = await Assignments.findOne({
			map: req.body.map,
			finished: false,
			congregation: req.publisher?.congregation,
		});

		if (exists) {
			return res.status(400).json({ message: "Map already assigned." });
		}

		const user = await Users.findById(req.body.user);

		if (!user) {
			return res.status(400).json({ message: "Invalid user assignment." });
		}

		const valid = await verifyMessage({
			address: user.address as `0x${string}`,
			message: getAssignmentMessage(req.body.map, user._id, req.body.expiration),
			signature: req.body.signature,
		});

		if (!valid) {
			return res.status(400).json({ message: "Invalid assignment." });
		}

		const current = new Date(Date.now()).toUTCString();
		const expiration = new Date(req.body.expiration).toUTCString();

		if (new Date(current).getTime() > new Date(expiration).getTime()) {
			return res.status(400).json({ message: "Expired assignment." });
		}

		const assignment = await new Assignments({
			publisher: req.publisher._id,
			map: req.body.map,
			permanent: false,
			congregation: req.publisher?.congregation,
		}).save();

		const map = await Maps.findByIdAndUpdate(req.body.map, {
			assigned: true,
		});

		await sendNotification(req.body.user, {
			title: `Designação aceita - ${map?.name}`,
			content: `${req.publisher.name} aceitou a sua designação via QR Code.`,
		});

		res.status(201).json({ assignment: assignment._id });
	} catch (error) {
		res.status(500).json({ message: "Error to create a assignment." });
	}
});

export default router;
