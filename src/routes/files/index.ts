import { Router } from "express";

const router = Router();

router.get("/", async (req, res, next) => {
	res.setHeader("Content-Type", "application/json");
	next();
});

export default router;
