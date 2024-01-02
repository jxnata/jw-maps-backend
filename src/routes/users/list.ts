import { Router } from 'express';
import master from '../../middleware/master';
import Users from '../../models/users';

const router = Router();

router.get('/', master, async (req, res) => {
    try {
        const { skip = 0, limit = 10 } = req.query;

        const users = await Users.find().skip(Number(skip)).limit(Number(limit));

        res.json({ users, skip, limit });
    } catch (error) {
        return res.status(400).json({ message: 'An error occurred while listing users.' })
    }
})

export default router;