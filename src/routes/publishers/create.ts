import { Router } from "express";
import { authorization } from "../../helpers/authorization";
import { normalization } from "../../helpers/normalization";
import authUser from "../../middleware/authUser";
import Publishers from "../../models/publishers";

const router = Router();

router.post("/", authUser, async (req, res) => {
	try {
		const username = normalization(req.body.name);

		let congregation;

		if (req.user && !req.isMaster) {
			congregation = req.user.congregation;
		} else {
			congregation = req.body.congregation;
		}

		const exists = await Publishers.find({ username, congregation });

		if (exists) {
			return res.status(400).json({ message: "Publisher with this name already exists." });
		}

		const code = authorization();

		const publisher = await new Publishers({
			...req.body,
			congregation,
			passcode: code,
		}).save();

		res.status(201).json({ publisher: publisher._id, passcode: code });
	} catch (error) {
		res.status(500).json({ message: "Error to create a publisher." });
	}
});

export default router;
