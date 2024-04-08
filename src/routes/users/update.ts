import { Router } from "express";
import { normalization } from "../../helpers/normalization";
import authUser from "../../middleware/authUser";
import Users from "../../models/users";

const router = Router();

router.put("/:id", authUser, async (req, res) => {
	try {
		const new_username = req.body.name ? normalization(req.body.name) : undefined;

		let congregation;

		if (req.user && !req.isMaster) {
			congregation = req.user.congregation;
		} else {
			congregation = req.body.congregation;
		}

		const exists = await Users.findOne({ username: new_username, congregation });

		if (exists) {
			if (exists._id !== req.params.id) {
				return res.status(400).json({ message: "User with this name already exists." });
			}
		}

		const user = await Users.findByIdAndUpdate(req.params.id, { ...req.body, congregation }, { new: true });

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		res.status(201).json({ user: user._id });
	} catch (error) {
		res.status(500).json({ message: "Error to create user." });
	}
});

export default router;
