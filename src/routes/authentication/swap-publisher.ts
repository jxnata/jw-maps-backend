import { Router } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../constants";
import authUser from "../../middleware/authUser";
import Users from "../../models/users";

const router = Router();

router.post("/swap-publisher", authUser, async (req, res) => {
	try {
		const user = await Users.findOne({ publisher: req.publisher?._id }).populate("congregation");

		if (!user) {
			return res.status(400).json({ message: "User not found." });
		}

		const token = jwt.sign({ user: user }, SECRET_KEY);

		res.json({ user, token });
	} catch (error) {
		res.status(500).json({ message: "Error to swap publisher to user" });
	}
});

export default router;
