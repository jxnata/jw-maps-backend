import { Router } from "express";
import master from "../../middleware/master";
import Publishers from "../../models/publishers";
import Users from "../../models/users";

const router = Router();

router.post("/:id/vinculate", master, async (req, res) => {
	try {
		const { publisher } = req.body;

		const existingPublisher = await Publishers.findById(publisher);

		if (!existingPublisher) {
			return res.status(400).json({ message: "Publisher not found." });
		}

		const user = await Users.findByIdAndUpdate(req.params.id, { publisher }, { new: true });

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		res.status(201).json({ user: user });
	} catch (error) {
		res.status(500).json({ message: "Error to vinculate user." });
	}
});

export default router;
