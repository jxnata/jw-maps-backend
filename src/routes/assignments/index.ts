import { Router } from "express";
import create from "./create";
import remove from "./delete";
import finish from "./finish";
import history from "./history";
import list from "./list";
import map from "./map";
import my from "./my";
import publisher from "./publisher";
import update from "./update";
import view from "./view";

const router = Router();

router.use(view);
router.use(create);
router.use(list);
router.use(update);
router.use(remove);
router.use(finish);
router.use(history);
router.use(my);
router.use(map);
router.use(publisher);

export default router;
