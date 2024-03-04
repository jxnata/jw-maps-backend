import { Router } from "express";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import master from "../../middleware/master";
import Users from "../../models/users";
import IUser from "../../models/users/types";

const router = Router();

router.post("/", master, async (req, res) => {
	try {
		const { username } = req.body;

		const existingUser = await Users.findOne({ username });

		if (existingUser) {
			return res.status(400).json({ message: "This username already exists." });
		}

		const private_key = generatePrivateKey()
		const account = privateKeyToAccount(private_key)

		const user = await new Users<IUser>({ ...req.body, private_key, address: account.address }).save();

		res.status(201).json({ user: user._id });
	} catch (error) {
		res.status(500).json({ message: "Error to create user." });
	}
});

export default router;
