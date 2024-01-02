import { Router } from 'express';
import { FilterQuery } from 'mongoose';
import authUser from '../../middleware/authUser';
import Maps from '../../models/maps';
import IMap from '../../models/maps/types';

const router = Router();

router.get('/all', authUser, async (req, res) => {
    try {

        let query: FilterQuery<IMap> = req.isMaster ? {} : { congregation: req.user?.congregation }

        const maps = await Maps.find(query).populate(['city', 'last_visited_by']);

        res.json({ maps });
    } catch (error) {
        res.status(500).json({ message: 'Error to list maps.' });
    }
});

export default router;