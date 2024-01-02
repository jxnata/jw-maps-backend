import { Router } from 'express';
import master from '../../middleware/master';
import Users from '../../models/users';

const router = Router();

router.delete('/:id', master, async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error to delete user.' });
    }
});

export default router;