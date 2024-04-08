import { Router } from "express";
import { FilterQuery } from "mongoose";
import { normalization } from "../../helpers/normalization";
import authUser from "../../middleware/authUser";
import Publishers from "../../models/publishers";
import IPublisher from "../../models/publishers/types";

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

		const exists = await Publishers.findOne({ username: new_username, congregation });

		if (exists) {
			if (exists._id !== req.params.id) {
				return res.status(400).json({ message: "Publisher with this name already exists." });
			}
		}

		const query: FilterQuery<IPublisher> = req.isMaster
			? { _id: req.params.id }
			: { _id: req.params.id, congregation };

		const publisher = await Publishers.findOneAndUpdate(
			query,
			{
				...req.body,
				passcode: undefined,
				username: new_username,
				congregation,
			},
			{ new: true }
		);

		if (!publisher) {
			return res.status(404).json({ message: "Publisher not found." });
		}

		res.json({ publisher: publisher._id });
	} catch (error) {
		res.status(500).json({ message: "Error to update publisher." });
	}
});

export default router;
