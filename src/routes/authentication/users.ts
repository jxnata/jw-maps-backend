import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../constants";
import Users from "../../models/users";

const router = Router();

router.post("/users", async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await Users.findOne({ username }).select("+password").populate("congregation");

		if (!user) {
			return res.status(400).json({ message: "User not found." });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(400).json({ message: "Wrong username or password." });
		}

		const userWithoutPassword = { ...user.toObject(), password: undefined };

		const token = jwt.sign({ user: userWithoutPassword }, SECRET_KEY);

		res.json({ user: userWithoutPassword, token });
	} catch (error) {
		res.status(500).json({ message: "Error to authenticate user" });
	}
});

export default router;
