import { Router } from "express";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { normalization } from "../../helpers/normalization";
import authUser from "../../middleware/authUser";
import Users from "../../models/users";
import IUser from "../../models/users/types";

const router = Router();

router.post("/", authUser, async (req, res) => {
	try {
		const username = normalization(req.body.name);

		let congregation;

		if (req.user && !req.isMaster) {
			congregation = req.user.congregation;
		} else {
			congregation = req.body.congregation;
		}

		const existingUser = await Users.findOne({ username, congregation });

		if (existingUser) {
			return res.status(400).json({ message: "This username already exists." });
		}

		const private_key = generatePrivateKey();
		const account = privateKeyToAccount(private_key);

		const user = await new Users<IUser>({
			...req.body,
			username,
			private_key,
			congregation,
			address: account.address,
		}).save();

		res.status(201).json({ user: user._id });
	} catch (error) {
		res.status(500).json({ message: "Error to create user." });
	}
});

export default router;
