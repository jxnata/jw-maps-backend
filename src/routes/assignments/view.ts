import { Router } from 'express';
import Assignments from '../../models/assignments';

const router = Router();

router.get('/view/:id', async (req, res) => {
    try {
        const assignment = await Assignments
            .findById(req.params.id)
            .populate(['publisher', {
                path: 'map',
                populate: {
                    path: 'city',
                    model: 'City',
                    select: 'name'
                }
            }]);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found.' });
        }
        res.json({ assignment });
    } catch (error) {
        res.status(500).json({ message: 'Error to get assignment.' });
    }
});

export default router;