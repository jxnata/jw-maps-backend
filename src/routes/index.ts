import { Router } from "express";
import assignments from "./assignments";
import auth from "./authentication";
import cities from "./cities";
import congregations from "./congregations";
import general from "./general";
import maps from "./maps";
import publishers from "./publishers";
import users from "./users";

const router = Router();

router.use("/assignments", assignments);
router.use("/auth", auth);
router.use("/cities", cities);
router.use("/congregations", congregations);
router.use("/general", general);
router.use("/maps", maps);
router.use("/publishers", publishers);
router.use("/users", users);

router.use('/apple-app-site-association', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

router.use('/assetlinks.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

export default router;
