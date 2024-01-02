import { Router } from 'express';
import { FilterQuery } from 'mongoose';
import { normalization } from '../../helpers/normalization';
import authUser from '../../middleware/authUser';
import Publishers from '../../models/publishers';
import IPublisher from '../../models/publishers/types';

const router = Router();

router.put('/:id', authUser, async (req, res) => {
    try {

        const newUsername = req.body.name ? normalization(req.body.name) : undefined
        const query: FilterQuery<IPublisher> = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

        const publisher = await Publishers.findOneAndUpdate(
            query,
            {
                ...req.body,
                passcode: undefined,
                username: newUsername,
                congregation: req.isMaster ? req.body.congregation : req.user?.congregation
            },
            { new: true }
        );

        if (!publisher) {
            return res.status(404).json({ message: 'Publisher not found.' });
        }

        res.json({ publisher: publisher._id });
    } catch (error) {
        res.status(500).json({ message: 'Error to update publisher.' });
    }
});

export default router;