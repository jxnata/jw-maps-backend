import { Router } from 'express';
import { FilterQuery } from 'mongoose';
import authUser from '../../middleware/authUser';
import Cities from '../../models/cities';
import ICity from '../../models/cities/types';

const router = Router();

router.get('/', authUser, async (req, res) => {
    try {
        const { skip = 0, limit = 10, search = '' } = req.query;

        let query: FilterQuery<ICity> = req.isMaster ? {} : { congregation: req.user?.congregation }

        if (search) {
            query = { ...query, name: { $regex: search, $options: 'i' } };
        }

        const cities = await Cities.find(query).skip(Number(skip)).limit(Number(limit));

        res.json({ cities, skip, limit });
    } catch (error) {
        res.status(500).json({ message: 'Error to list cities.' });
    }
});

export default router;