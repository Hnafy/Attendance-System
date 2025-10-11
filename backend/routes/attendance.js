import express from "express";
import { adminIdMatch, authorization, isAdmin, TableAuth, verifyToken } from "../middleware/auth.js";
import  { deleteAttendance, getAllAttendance, getAttendance, presentStudent, submitAttendance } from "../controllers/attendanceController.js";
let router = express.Router();

router.route("/").get(verifyToken,TableAuth,getAttendance)
router.route("/allStudents/:id").get(verifyToken,adminIdMatch,getAllAttendance)
router.route("/:className")
.post(verifyToken,authorization,submitAttendance);
router.route("/:id").put(verifyToken,isAdmin,presentStudent).delete(verifyToken,isAdmin,deleteAttendance)

export default router;
