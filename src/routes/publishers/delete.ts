import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import Publishers from "../../models/publishers";
import IPublisher from "../../models/publishers/types";

const router = Router();

router.delete("/:id", authUser, async (req, res) => {
	try {
		const query: FilterQuery<IPublisher> = req.isMaster
			? { _id: req.params.id }
			: { _id: req.params.id, congregation: req.user?.congregation };

		const publisher = await Publishers.findOneAndDelete(query);

		if (!publisher) {
			return res.status(404).json({ message: "Publisher not found." });
		}

		if (publisher.value?._id) {
			await Assignments.deleteMany({ publisher: publisher.value._id });
		}

		res.json({ message: "Publisher deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error to delete publisher." });
	}
});

export default router;
