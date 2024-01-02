import { Router } from "express";
import publishers from "./publishers";
import users from "./users";

const router = Router();

router.use(publishers);
router.use(users);

export default router;
