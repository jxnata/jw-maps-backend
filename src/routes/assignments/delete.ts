import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import IAssignment from "../../models/assignments/types";

const router = Router();

router.delete("/:id", authUser, async (req, res) => {
	try {
		const query: FilterQuery<IAssignment> = req.isMaster
			? { _id: req.params.id }
			: { _id: req.params.id, congregation: req.user?.congregation };

		const assignment = await Assignments.findOneAndDelete(query);

		if (!assignment) {
			return res.status(404).json({ message: "Assignment not found." });
		}

		res.json({ message: "Assignment deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error to delete assignment." });
	}
});

export default router;
