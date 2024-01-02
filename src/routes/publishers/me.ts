import { Router } from 'express';
import authPublisher from '../../middleware/authPublisher';
import Publishers from '../../models/publishers';

const router = Router();

router.get('/me', authPublisher, async (req, res) => {
    try {
        const publisher = await Publishers.findById(req.publisher?._id).populate('congregation');

        if (!publisher) {
            return res.status(404).json({ message: 'Publisher not found.' });
        }
        res.json({ publisher });
    } catch (error) {
        res.status(500).json({ message: 'Error to get publisher.' });
    }
});

export default router;