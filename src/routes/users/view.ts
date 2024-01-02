import { Router } from "express";
import authUser from "../../middleware/authUser";
import Users from "../../models/users";

const router = Router();

router.get("/view/:id", authUser, async (req, res) => {
	try {
		const user = await Users.findById(req.params.id).populate("congregation");

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		return res.json({ user });
	} catch (error) {
		return res.status(400).json({ message: "An error occurred while fetching the user." });
	}
});

export default router;
