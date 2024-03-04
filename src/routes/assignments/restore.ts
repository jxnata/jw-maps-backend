import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import IAssignment from "../../models/assignments/types";

const router = Router();

router.post("/restore", authUser, async (req, res) => {
	try {
		const query: FilterQuery<IAssignment> = req.isMaster
			? { finished: false, permanent: false }
			: { congregation: req.user?.congregation, finished: false, permanent: false };

		const assignments = await Assignments.deleteMany(query);

		if (req.isMaster) {
			console.info(`JOB [monthly-restore-assignments] RESULT ==> ${assignments.deletedCount}`);
		}

		res.json({ message: "Assignments successfully restored" });
	} catch (error) {
		res.status(500).json({ message: "Error to restore assignments." });
	}
});

export default router;
