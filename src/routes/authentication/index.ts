import { Router } from "express";
import publishers from "./publishers";
import swap from "./swap";
import users from "./users";

const router = Router();

router.use(publishers);
router.use(users);
router.use(swap);

export default router;
