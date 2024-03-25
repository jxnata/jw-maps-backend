import { Router } from "express";
import backup from "./backup";
import restore from "./restore";

const router = Router();

router.use(backup);
router.use(restore);

export default router;
