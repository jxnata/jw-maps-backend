import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import Maps from "../../models/maps";
import Publishers from "../../models/publishers";
import IPublisher from "../../models/publishers/types";

const router = Router();

router.delete("/:id", authUser, async (req, res) => {
	try {
		const query: FilterQuery<IPublisher> = req.isMaster
			? { _id: req.params.id }
			: { _id: req.params.id, congregation: req.user?.congregation };

		const publisher = await Publishers.findOneAndDelete(query, { returnDocument: "before" });

		if (!publisher) {
			return res.status(404).json({ message: "Publisher not found." });
		}

		const assignments = await Assignments.find({ publisher: publisher._id });
		const map_ids = assignments.map(assignment => assignment.map);

		await Assignments.deleteMany({ publisher: publisher._id });

		await Maps.updateMany({ _id: { $in: map_ids } }, { $set: { assigned: false } });

		res.json({ message: "Publisher deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error to delete publisher." });
	}
});

export default router;
