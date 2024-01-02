import { Router } from 'express';
import assignments from './assignments';
import auth from './authentication';
import cities from './cities';
import congregations from './congregations';
import general from './general';
import maps from './maps';
import publishers from './publishers';
import users from './users';

const router = Router();

router.use('/assignments', assignments);
router.use('/auth', auth);
router.use('/cities', cities);
router.use('/congregations', congregations);
router.use('/general', general);
router.use('/maps', maps);
router.use('/publishers', publishers);
router.use('/users', users);

export default router