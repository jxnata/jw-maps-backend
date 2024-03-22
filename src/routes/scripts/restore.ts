import { Router } from "express";
import mongoose from "mongoose";
import master from "../../middleware/master";
import Assignments from "../../models/assignments";
import Cities from "../../models/cities";
import Congregations from "../../models/congregations";
import Maps from "../../models/maps";
import Publishers from "../../models/publishers";
import Users from "../../models/users";

const router = Router();

router.post("/restore", master, async (req, res) => {
    try {
        const db_name = mongoose.connection.name;

        if (process.env.NODE_ENV !== "development") {
            return res.status(500).json({ message: "Only available in development mode." });
        }

        if (db_name !== "jw-maps-dev") {
            return res.status(500).json({ message: "Restoration is available only in dev database." });
        }

        const { assignments, cities, congregations, maps, publishers, users } = req.body

        await Assignments.deleteMany({})
        await Assignments.insertMany(assignments)

        await Cities.deleteMany({})
        await Cities.insertMany(cities)

        await Congregations.deleteMany({})
        await Congregations.insertMany(congregations)

        await Maps.deleteMany({})
        await Maps.insertMany(maps)

        await Publishers.deleteMany({})
        await Publishers.insertMany(publishers)

        await Users.deleteMany({})
        await Users.insertMany(users)

        res.status(200).json({ message: "Restoration success!" });
    } catch (error: any) {
        res.status(500).json({ message: "Restoration error." });
    }
});

export default router;