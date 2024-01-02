import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import IAssignment from "../../models/assignments/types";

const router = Router();

router.put("/:id", authUser, async (req, res) => {
	try {
		const query: FilterQuery<IAssignment> = req.isMaster
			? { _id: req.params.id }
			: { _id: req.params.id, congregation: req.user?.congregation };

		const assignment = await Assignments.findOneAndUpdate(
			query,
			{
				...req.body,
				congregation: req.isMaster ? req.body.congregation : req.user?.congregation,
			},
			{ new: true }
		);

		if (!assignment) {
			return res.status(404).json({ message: "Assignment not found." });
		}

		res.json({ assignment: assignment._id });
	} catch (error) {
		res.status(500).json({ message: "Error to update assignment." });
	}
});

export default router;
