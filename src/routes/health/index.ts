import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
	try {
		res.status(200).json({ ok: true });
	} catch (error) {
		res.status(500).json({ ok: false });
	}
});

export default router;
