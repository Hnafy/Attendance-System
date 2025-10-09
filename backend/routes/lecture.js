import express from "express";
import { cancelTakeAttendance, deleteLecture, getLectures, postLecture, startTakeAttendance, statusTakeAttendance, updateLecture } from "../controllers/lectureController.js";
import { adminIdMatch, isAdmin, verifyToken } from "../middleware/auth.js";
let router = express.Router();

router.route("/").post(verifyToken,isAdmin,postLecture);
router.route("/:id").get(verifyToken,adminIdMatch,getLectures).put(verifyToken,isAdmin,updateLecture).delete(verifyToken,isAdmin,deleteLecture);
router.route("/start/:lectureId").post(verifyToken,isAdmin,startTakeAttendance);
router.route("/cancel/:lectureId").post(verifyToken,isAdmin,cancelTakeAttendance);
router.route("/status/:lectureId").get(verifyToken,isAdmin,statusTakeAttendance);

export default router;
