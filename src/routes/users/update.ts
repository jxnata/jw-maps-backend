import { Router } from 'express';
import master from '../../middleware/master';
import Users from '../../models/users';

const router = Router();

router.put('/:id', master, async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(201).json({ user: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error to create user.' });
    }
});

export default router;