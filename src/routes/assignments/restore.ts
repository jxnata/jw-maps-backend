import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import IAssignment from "../../models/assignments/types";
import Maps from "../../models/maps";

const router = Router();

router.post("/restore", authUser, async (req, res) => {
	try {
		const query: FilterQuery<IAssignment> = req.isMaster
			? { finished: false, permanent: false }
			: { congregation: req.user?.congregation, finished: false, permanent: false };

		const assignments = await Assignments.find(query);
		const result = await Assignments.deleteMany(query);

		const map_ids = assignments.map(assignment => assignment.map);

		await Maps.updateMany({ _id: { $in: map_ids } }, { $set: { assigned: false } });

		if (req.isMaster) {
			console.info(`JOB [monthly-restore-assignments] RESULT ==> ${result.deletedCount}`);
		}

		res.json({ message: "Assignments successfully restored" });
	} catch (error) {
		res.status(500).json({ message: "Error to restore assignments." });
	}
});

export default router;
