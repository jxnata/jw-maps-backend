import { Router } from 'express';
import authUser from '../../middleware/authUser';
import Publishers from '../../models/publishers';

const router = Router();

router.get('/view/:id', authUser, async (req, res) => {
    try {
        const publisher = await Publishers.findById(req.params.id).populate('congregation');

        if (!publisher) {
            return res.status(404).json({ message: 'Publisher not found.' });
        }
        res.json({ publisher });
    } catch (error) {
        res.status(500).json({ message: 'Error to get publisher.' });
    }
});

export default router;