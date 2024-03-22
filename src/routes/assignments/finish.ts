import { Router } from "express";
import authPublisher from "../../middleware/authPublisher";
import Assignments from "../../models/assignments";
import Maps from "../../models/maps";

const router = Router();

router.put("/:id/finish", authPublisher, async (req, res) => {
	try {
		const assignment = await Assignments.findOneAndUpdate(
			{ _id: req.params.id, publisher: req.publisher?._id, finished: false },
			{
				found: req.body.found,
				details: req.body.details,
				finished: true,
			},
			{ new: true }
		);

		if (!assignment) {
			return res.status(404).json({ message: "Assignment not found." });
		}

		let updatedMap: any = {
			last_visited: Date.now(),
			last_visited_by: assignment?.publisher,
		};

		if (req.body.found) {
			updatedMap = {
				...updatedMap,
				updated_at: Date.now(),
			};
		}

		await Maps.findByIdAndUpdate(assignment?.map, updatedMap);

		res.json({ assignment: assignment._id });
	} catch (error) {
		res.status(500).json({ message: "Error to update assignment." });
	}
});

export default router;
