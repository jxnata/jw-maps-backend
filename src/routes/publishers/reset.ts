import bcrypt from "bcrypt";
import { Router } from "express";
import { FilterQuery } from "mongoose";
import { SALT_ROUNDS } from "../../constants";
import { authorization } from "../../helpers/authorization";
import authUser from "../../middleware/authUser";
import Publishers from "../../models/publishers";
import IPublisher from "../../models/publishers/types";

const router = Router();

router.put("/reset/:id", authUser, async (req, res) => {
	try {
		const query: FilterQuery<IPublisher> = req.isMaster
			? { _id: req.params.id }
			: { _id: req.params.id, congregation: req.user?.congregation };

		const code = authorization();

		const hashedPasscode = await bcrypt.hash(code, SALT_ROUNDS);

		const publisher = await Publishers.findOneAndUpdate(query, { passcode: hashedPasscode }, { new: true });

		if (!publisher) {
			return res.status(404).json({ message: "Publisher not found." });
		}

		res.json({ publisher: publisher._id, passcode: code });
	} catch (error) {
		res.status(500).json({ message: "Error to reset publisher." });
	}
});

export default router;
