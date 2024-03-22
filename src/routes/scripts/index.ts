import { Router } from "express";
import add_updated_at from "./add-updated_at";
import backup from "./backup";
import restore from "./restore";

const router = Router();

router.use(add_updated_at);
router.use(backup);
router.use(restore);

export default router;
