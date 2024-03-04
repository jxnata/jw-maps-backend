import { Router } from "express";
import master from "../../middleware/master";
import Assignments from "../../models/assignments";

const router = Router();

router.post("/yearly-delete", master, async (req, res) => {
	try {
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

		const result = await Assignments.deleteMany({ created_at: { $lt: oneYearAgo }, permanent: false });

		console.info(`JOB [yearly-delete-assignments] RESULT ==> ${result.deletedCount}`);

		res.json({ message: "Assignments successfully deleted" });
	} catch (error) {
		res.status(500).json({ message: "Error to delete assignments." });
	}
});

export default router;
