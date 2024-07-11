import { Router } from "express";
import authUser from "../../middleware/authUser";
import Maps from "../../models/maps";
import { FilterQuery } from "mongoose";
import IMap from "../../models/maps/types";

const router = Router();

router.get("/districts", authUser, async (req, res) => {
    try {
        let query: FilterQuery<IMap> = req.isMaster ? {} : { congregation: req.user?.congregation };

        const districts = await Maps.aggregate([
            {
                $match: query,
            },
            {
                $group: {
                    _id: "$city",
                    districts: { $addToSet: "$district" },
                },
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "_id",
                    foreignField: "_id",
                    as: "city",
                },
            },
            {
                $unwind: "$city",
            },
            {
                $project: {
                    _id: 0,
                    city_id: "$city._id",
                    districts: 1,
                },
            },
        ]);

        const response = districts.reduce((acc, { city_id, districts }) => {
            acc[city_id] = districts;
            return acc;
        }, {});

        res.json({ districts: response });
    } catch (error) {
        res.status(500).json({ message: "Failed to list districts due to an internal server error." });
    }
});

export default router;
