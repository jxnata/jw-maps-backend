import { Router } from 'express';
import all from './all';
import create from './create';
import remove from './delete';
import list from './list';
import me from './me';
import reset from './reset';
import update from './update';
import view from './view';

const router = Router();

router.use(view);
router.use(create);
router.use(list);
router.use(update);
router.use(remove);
router.use(all);
router.use(me);
router.use(reset);

export default router;