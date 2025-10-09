import dotenv from "dotenv";
import { lectureModel, validateLecture, validateUpdateLecture } from "../models/lectureModel.js";
import attendanceSessionModel from "../models/attendanceSessionModel.js";
dotenv.config();

let getLectures = async (req, res) => {
    try {
        let result = await lectureModel.find({professorId:req.user.id});
        res.json(result);
    } catch (err) {
        res.send(err.message);
    }
};

let postLecture = async (req, res) => {
    try {
        // validate inputs
        let { error } = validateLecture(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        // save in db
        let storagePost = await lectureModel.create({
            lectureName: req.body.lectureName,
            className: req.body.className,
            professorId: req.user.id,
            // startTime: req.body.startTime, // <input type="datetime-local" name="birthDaTime">
            // endTime: new Date(new Date(req.body.startTime).getTime() + 2 * 60 * 60 * 1000).toISOString(),
        });

        res.json({ msg: "lecture created", data: storagePost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

let updateLecture = async (req, res) => {
    try {
        // validate inputs
        let { error } = validateUpdateLecture(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }
        let existingLecture = await lectureModel.findByIdAndUpdate(req.params.id,{
            lectureName: req.body.lectureName,
            className: req.body.className,
            // startTime: req.body.startTime, // <input type="datetime-local" name="birthDaTime">
            // endTime: new Date(new Date(req.body.startTime).getTime() + 2 * 60 * 60 * 1000).toISOString(),
        }, { new: true });
        if (!existingLecture) {
            return res.status(404).json({ msg: "Lecture not found" });
        }

        res.json({ msg: "lecture Updated", data: existingLecture });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

let deleteLecture = async (req, res) => {
    try {
        let existingLecture = await lectureModel.findByIdAndDelete(req.params.id);
        if (!existingLecture) {
            return res.status(404).json({ msg: "Lecture not found" });
        }

        res.json({ msg: "lecture Deleted", data: existingLecture });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ✅ Start attendance for a specific lecture
let startTakeAttendance = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Check if a session is already active for this lecture
    const existing = await attendanceSessionModel.findOne({
      lectureId,
      isActive: true,
    });
    if (existing)
      return res.status(400).json({ message: "Attendance already active" });

    // Create new attendance session
    const session = new attendanceSessionModel({
      lectureId,
      isActive: true,
      startTime: new Date(),
    });

    await session.save();

    // ✅ Populate lecture details (className, lectureName)
    const populatedSession = await session.populate("lectureId");

    res.status(200).json({ message: "Attendance started", session: populatedSession });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Cancel attendance for a specific lecture
let cancelTakeAttendance = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const session = await attendanceSessionModel.findOne({
      lectureId,
      isActive: true,
    });

    if (!session)
      return res.status(404).json({ message: "No active session for this lecture" });

    session.isActive = false;
    session.endTime = new Date();
    await session.save();

    // ✅ Populate lecture details after cancelling
    const populatedSession = await session.populate("lectureId");

    res.status(200).json({ message: "Attendance cancelled", session: populatedSession });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

let statusTakeAttendance = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const session = await attendanceSessionModel.findOne({
      lectureId,
      isActive: true,
    });
    res.status(200).json({ active: !!session, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export { getLectures, postLecture,updateLecture,deleteLecture,startTakeAttendance,cancelTakeAttendance,statusTakeAttendance };
