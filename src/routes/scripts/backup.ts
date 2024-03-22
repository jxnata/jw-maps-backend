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

router.post("/backup", master, async (req, res) => {
	try {
		const db_name = mongoose.connection.name;

		if (db_name !== "jw-maps") {
			return res.status(500).json({ message: "Backup is available only in production database" });
		}

		const assignments = await Assignments.find({});
		const cities = await Cities.find({});
		const congregations = await Congregations.find({});
		const maps = await Maps.find({});
		const publishers = await Publishers.find({}).select(["+username", "+passcode"]);
		const users = await Users.find({}).select(["+password", "+private_key"]);

		res.status(200).json({ assignments, cities, congregations, maps, publishers, users });
	} catch (error: any) {
		error.getWriteErrors().forEach(function (err: any) {
			if (err.code != 11000) {
				res.status(500).json({ message: "Script error." });
			}
		});
	}
});

export default router;
