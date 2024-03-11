import express, { Router } from "express";
import path from "path";
import assignments from "./assignments";
import auth from "./authentication";
import cities from "./cities";
import congregations from "./congregations";
import files from "./files";
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

router.use("/apple-app-site-association", files);
router.use("/assetlinks.json", files);

router.use('/.well-known', express.static(path.join(__dirname, 'public')));

export default router;
