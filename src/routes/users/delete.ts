import { Router } from "express";
import authUser from "../../middleware/authUser";
import Users from "../../models/users";

const router = Router();

router.delete("/:id", authUser, async (req, res) => {
	try {
		let user;

		if (req.isMaster) {
			user = await Users.findByIdAndDelete(req.params.id);
		} else {
			user = await Users.findOneAndDelete({ _id: req.params.id, congregation: req.user?.congregation });
		}

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		res.json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error to delete user." });
	}
});

export default router;
