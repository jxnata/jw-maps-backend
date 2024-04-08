import { Router } from "express";
import backup from "./backup";
import restore from "./restore";
import wake_up from "./wake-up";

const router = Router();

router.use(backup);
router.use(restore);
router.use(wake_up);

export default router;
