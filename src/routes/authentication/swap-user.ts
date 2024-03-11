import { Router } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../constants";
import authUser from "../../middleware/authUser";
import Publishers from "../../models/publishers";

const router = Router();

router.post("/swap-user", authUser, async (req, res) => {
	try {
		if (!req.user?.publisher) {
			return res.status(400).json({ message: "Publisher not vinculated." });
		}

		const publisher = await Publishers.findById(req.user.publisher).populate("congregation");

		if (!publisher) {
			return res.status(400).json({ message: "Publisher not found." });
		}

		const token = jwt.sign({ publisher: publisher }, SECRET_KEY);

		res.json({ publisher, token });
	} catch (error) {
		res.status(500).json({ message: "Error to swap user to publisher" });
	}
});

export default router;
