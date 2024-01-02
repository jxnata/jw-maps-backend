import { Router } from 'express';
import authUser from '../../middleware/authUser';
import Cities from '../../models/cities';

const router = Router();

router.post('/', authUser, async (req, res) => {
    try {
        const { name, congregation } = req.body;

        const city = await new Cities({ name, congregation: req.user?.congregation || congregation }).save();

        res.status(201).json({ city: city._id });
    } catch (error) {
        res.status(500).json({ message: 'Error to create a city.' });
    }
});

export default router;