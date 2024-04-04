import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
	res.redirect("https://jw-toolkit-backend.onrender.com" + req.originalUrl);
});

export default router;
