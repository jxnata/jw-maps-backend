import axios from "axios";
import { Router } from "express";
import master from "../../middleware/master";

const router = Router();

router.post("/wake-up", master, async (req, res) => {
	try {
		axios.get("https://jw-toolkit-backend.onrender.com/health");
		res.status(200).json({ ok: true });
	} catch (error) {
		res.status(200).json({ ok: false });
	}
});

export default router;
