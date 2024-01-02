import { Router } from 'express';
import resume from './resume';

const router = Router();

router.use(resume);

export default router;