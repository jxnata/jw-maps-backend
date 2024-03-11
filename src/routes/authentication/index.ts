import { Router } from "express";
import publishers from "./publishers";
import swap_publisher from "./swap-publisher";
import swap_user from "./swap-user";
import users from "./users";

const router = Router();

router.use(publishers);
router.use(users);
router.use(swap_user);
router.use(swap_publisher);

export default router;
