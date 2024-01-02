import { Router } from "express";
import all from "./all";
import create from "./create";
import remove from "./delete";
import list from "./list";
import unassigned from "./unassigned";
import update from "./update";
import view from "./view";

const router = Router();

router.use(view);
router.use(create);
router.use(list);
router.use(update);
router.use(remove);
router.use(all);
router.use(unassigned);

export default router;
