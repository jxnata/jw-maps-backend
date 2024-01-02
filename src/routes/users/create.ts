import { Router } from 'express';
import master from '../../middleware/master';
import Users from '../../models/users';

const router = Router();

router.post('/', master, async (req, res) => {
    try {
        const { username } = req.body;

        const existingUser = await Users.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'This username already exists.' });
        }

        const user = await new Users(req.body).save()

        res.status(201).json({ user: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error to create user.' });
    }
});

export default router;