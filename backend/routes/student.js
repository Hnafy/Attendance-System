import express from "express";
import { getStudents, postStudent, loginStudent, getStudentWithAttendance } from "../controllers/studentController.js";
import { TableAuth, verifyToken } from "../middleware/auth.js";

let router = express.Router();

router.route("/").get(getStudents).post(postStudent);
router.post("/login", loginStudent);
router.get("/attendance",verifyToken,TableAuth, getStudentWithAttendance); 

router.get("/verify", verifyToken, (req, res) => {
  res.json({
    msg: "Token is valid",
    user: req.user,
  });
});

export default router;
