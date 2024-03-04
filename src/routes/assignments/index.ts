import { Router } from "express";
import create from "./create";
import remove from "./delete";
import finish from "./finish";
import history from "./history";
import list from "./list";
import map from "./map";
import my from "./my";
import publisher from "./publisher";
import restore from "./restore";
import update from "./update";
import view from "./view";
import yearly_delete from "./yearly-delete";

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
router.use(restore);
router.use(yearly_delete);

export default router;
