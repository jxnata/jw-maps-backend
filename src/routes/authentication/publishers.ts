import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../constants";
import { normalization } from "../../helpers/normalization";
import Publishers from "../../models/publishers";

const router = Router();

router.post("/publishers", async (req, res) => {
	try {
		const { username, passcode } = req.body;

		const publisher = await Publishers.findOne({ username: normalization(username) })
			.select("+passcode")
			.populate("congregation");

		if (!publisher) {
			return res.status(400).json({ message: "Publisher not found." });
		}

		const passwordMatch = await bcrypt.compare(passcode, publisher.passcode);

		if (!passwordMatch) {
			return res.status(400).json({ message: "Wrong username or passcode." });
		}

		const publisherWithoutPassword = { ...publisher.toObject(), passcode: undefined };

		const token = jwt.sign({ publisher: publisherWithoutPassword }, SECRET_KEY);

		res.json({ publisher: publisherWithoutPassword, token });
	} catch (error) {
		res.status(500).json({ message: "Error to authenticate user" });
	}
});

export default router;
