import { Router } from 'express';
import master from '../../middleware/master';
import Congregations from '../../models/congregations';

const router = Router();

router.post('/', master, async (req, res) => {
    try {
        const { name } = req.body;

        const congregation = await new Congregations({ name }).save();

        res.status(201).json({ congregation: congregation._id });
    } catch (error) {
        res.status(500).json({ message: 'Error to create a congregation.' });
    }
});

export default router;