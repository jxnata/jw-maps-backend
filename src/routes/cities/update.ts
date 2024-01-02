import { Router } from 'express';
import { FilterQuery } from 'mongoose';
import authUser from '../../middleware/authUser';
import Cities from '../../models/cities';
import ICity from '../../models/cities/types';

const router = Router();

router.put('/:id', authUser, async (req, res) => {
    try {
        const query: FilterQuery<ICity> = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation };

        const city = await Cities.findOneAndUpdate(
            query,
            {
                ...req.body,
                congregation: req.isMaster ? req.body.congregation : req.user?.congregation
            },
            { new: true }
        );

        if (!city) {
            return res.status(404).json({ message: 'City not found.' });
        }

        res.json({ city: city._id });
    } catch (error) {
        res.status(500).json({ message: 'Error to update city.' });
    }
});

export default router;