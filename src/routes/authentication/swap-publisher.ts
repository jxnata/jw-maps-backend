import { Router } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../constants";
import authPublisher from "../../middleware/authPublisher";
import Users from "../../models/users";

const router = Router();

router.post("/swap-publisher", authPublisher, async (req, res) => {
	try {
		const user = await Users.findOne({ publisher: req.publisher?._id })
			.populate("congregation")
			.select("+private_key");

		if (!user) {
			return res.status(400).json({ message: "User not found." });
		}

		const token = jwt.sign({ user: user }, SECRET_KEY);

		const userWithoutSecrets = { ...user.toObject(), password: undefined, private_key: undefined };

		res.json({ user: userWithoutSecrets, token, private_key: user.private_key });
	} catch (error) {
		res.status(500).json({ message: "Error to swap publisher to user" });
	}
});

export default router;
