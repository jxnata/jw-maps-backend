import { Router } from 'express';
import master from '../../middleware/master';
import Assignments from '../../models/assignments';
import Congregations from '../../models/congregations';
import Maps from '../../models/maps';
import Publishers from '../../models/publishers';
import Users from '../../models/users';

const router = Router();

router.delete('/:id', master, async (req, res) => {
    try {
        const congregation = await Congregations.findByIdAndDelete(req.params.id);

        if (!congregation) {
            return res.status(404).json({ message: 'Congregation not found.' });
        }

        await Maps.deleteMany({ congregation: congregation._id });
        await Assignments.deleteMany({ congregation: congregation._id });
        await Publishers.deleteMany({ congregation: congregation._id });
        await Users.deleteMany({ congregation: congregation._id });

        res.json({ message: 'Congregation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error to delete congregation.' });
    }
});

export default router;