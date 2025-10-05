import express from "express";
import { deleteLecture, getLectures, postLecture, updateLecture } from "../controllers/lectureController.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";
let router = express.Router();

router.route("/").get(getLectures).post(verifyToken,isAdmin,postLecture);
router.route("/:id").put(verifyToken,isAdmin,updateLecture).delete(verifyToken,isAdmin,deleteLecture);

export default router;
