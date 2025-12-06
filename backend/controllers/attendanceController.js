import attendanceModel from "../models/attendanceModel.js";
import attendanceSessionModel from "../models/attendanceSessionModel.js";
import { lectureModel } from "../models/lectureModel.js";
import { StudentModel } from "../models/studentModel.js";

// 📍 Define multiple allowed places
const ALLOWED_PLACES = [
    {
        name: "Sadat management build",
        lat: 30.41375,
        lon: 30.5368817,
        maxDistance: 1.2,
    },
    { name: "Lecture hall", lat: 30.40565, lon: 30.54068, maxDistance: 1.0 },
    { name: "Bajor", lat: 30.4282639, lon: 31.0392314, maxDistance: 1.0 },
    // { name: "zaton", lat: 30.4218112, lon: 30.5168384, maxDistance: 1.0 },
];

// 📘 Get attendance by student
const getAttendance = async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ message: "studentId is required" });
        }

        const result = await attendanceModel
            .find({ studentId })
            .populate("studentId")
            .populate("lectureId")
            .sort({ createdAt: -1 });

        if (result.length === 0) {
            return res
                .status(404)
                .json({ message: "No attendance record found" });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📘 Get attendance by professor
const getAllAttendance = async (req, res) => {
    try {
        const result = await attendanceModel
            .find({ professorId: req.user.id })
            .populate("studentId")
            .populate("lectureId")
            .sort({ createdAt: -1 });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📘 Helper: calculate distance between two coordinates using Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
}

// 📘 Helper: check if location is within any allowed place
function isWithinAllowedLocation(lat, long) {
    for (const place of ALLOWED_PLACES) {
        const distance = getDistanceFromLatLonInKm(
            lat,
            long,
            place.lat,
            place.lon
        );
        if (distance < place.maxDistance) {
            return true;
        }
    }
    return false;
}

// 📘 Submit attendance
const submitAttendance = async (req, res) => {
  try {
    const { studentId, deviceId, lat, long } = req.body;
    const className = req.params.className;
    const now = new Date();

    if (!studentId || !deviceId) {
      return res
        .status(400)
        .json({ message: "studentId and deviceId are required" });
    }

    // 🔹 Find all lectures for this class
    const lectures = await lectureModel.find({ className: className });

    if (!lectures || lectures.length === 0) {
      return res.status(404).json({ message: "No lecture found for this class" });
    }

    // 🔹 Extract IDs to search for active session
    const lectureIds = lectures.map((l) => l._id);

    // 🔹 Find an active session for any lecture of this class
    const session = await attendanceSessionModel
      .findOne({
        isActive: true,
        lectureId: { $in: lectureIds },
      })
      .populate("lectureId");

    if (!session) {
      return res
        .status(404)
        .json({ message: "No active session for this class" });
    }

    const activeLecture = session.lectureId; // the lecture object of this active session

    // 🔹 Check if this student already attended this lecture
    const alreadyAttended = await attendanceModel.findOne({
      studentId,
      lectureId: activeLecture._id,
    });

    if (alreadyAttended) {
      return res
        .status(400)
        .json({ message: "You already took attendance for this lecture" });
    }

    // 🔹 Determine attendance status
    let status = "present";

    // 🔹 Late check (>30 minutes)
    const diffMinutes =
      (now - new Date(activeLecture.startTime)) / (1000 * 60);

    if (diffMinutes > 30) status = "late";

    // 🔹 Check if same device was used before for this lecture
    const sameDevice = await attendanceModel.findOne({
      deviceId,
      lectureId: activeLecture._id,
    });

    if (sameDevice) status = "suspicious";

    // 🔹 Check location
    if (!lat || !long) {
      status = "suspicious";
    } else {
      if (!isWithinAllowedLocation(lat, long)) {
        status = "outside";
      }
    }

    // 🔹 Save attendance
    const newAttendance = await attendanceModel.create({
      studentId,
      lectureId: activeLecture._id,
      professorId: activeLecture.professorId,
      className,
      status,
      deviceId,
      lat,
      long,
      time: now,
    });

    // 🔹 Get updated attendances for this student
    const attendances = await attendanceModel
      .find({ studentId })
      .populate("studentId")
      .populate("lectureId")
      .sort({ time: -1 });

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendances,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📘 Submit attendance
const submitAttendanceGuest = async (req, res) => {
    try {
        const { studentName, studentCode, deviceId, lat, long } = req.body;
        const className = req.params.className;
        const now = new Date();

        if (!studentName || !studentCode || !deviceId) {
            return res
                .status(400)
                .json({
                    message: "Student name, code, and deviceId are required",
                });
        }

        // 🔹 Find student by code
        let student = await StudentModel.findOne({ studentCode });

        // 🔹 If student doesn't exist → create on the fly
        if (!student) {
            student = await StudentModel.create({
                name: studentName,
                studentCode,
            });
        }

        // 🔹 Find lectures for the class
        const lecture = await lectureModel.find({ className });
        if (!lecture.length)
            return res.status(404).json({ message: "No lecture found" });

        const lectureIds = lecture.map((l) => l._id);

        // 🔹 Find active session
        const session = await attendanceSessionModel
            .findOne({
                isActive: true,
                lectureId: { $in: lectureIds },
            })
            .populate("lectureId");

        if (!session)
            return res
                .status(404)
                .json({ message: "No active session for this class" });

        // 🔹 Check duplicate attendance
        const alreadyAttended = await attendanceModel.findOne({
            studentId: student._id,
            lectureId: session.lectureId._id,
        });
        if (alreadyAttended)
            return res.status(400).json({ message: "Already attended" });

        // 🔹 Determine attendance status
        let status = "present";
        const diffMinutes =
            (now - new Date(lecture[0].startTime)) / (1000 * 60);
        if (diffMinutes > 30) status = "late";

        const sameDevice = await attendanceModel.findOne({
            deviceId,
            lectureId: lecture[0]._id,
        });
        if (sameDevice) status = "suspicious";

        if (!lat || !long) status = "suspicious";
        else if (!isWithinAllowedLocation(lat, long)) status = "outside";

        // 🔹 Save attendance
        const newAttendance = await attendanceModel.create({
            studentId: student._id,
            lectureId: session.lectureId._id,
            professorId: lecture[0].professorId,
            className,
            status,
            deviceId,
            lat,
            long,
            time: now,
        });

        res.status(201).json({
            message: "Attendance recorded successfully",
            attendance: newAttendance,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📘 Mark student as present (admin override)
let presentStudent = async (req, res) => {
    try {
        let existingAttendance = await attendanceModel
            .findByIdAndUpdate(
                req.params.id,
                { status: "present" },
                { new: true }
            )
            .populate("studentId")
            .populate("lectureId");

        if (!existingAttendance) {
            return res.status(404).json({ msg: "Lecture not found" });
        }

        res.json({
            msg: `The admin has marked (${existingAttendance.studentId.name}) as present.`,
            data: existingAttendance,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📘 Delete single attendance record
let deleteAttendance = async (req, res) => {
    try {
        let existingAttendance = await attendanceModel.findByIdAndDelete(
            req.params.id
        );
        if (!existingAttendance) {
            return res.status(404).json({ msg: "attendance not found" });
        }

        res.json({ msg: "attendance Deleted", data: existingAttendance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📘 Delete all attendance records for a professor
let deleteAllAttendance = async (req, res) => {
    try {
        const professorId = req.params.id;

        // Delete all attendance documents matching this professor
        const result = await attendanceModel.deleteMany({ professorId });

        // If no documents were deleted
        if (result.deletedCount === 0) {
            return res
                .status(404)
                .json({ msg: "No attendance found for this professor" });
        }

        res.json({
            msg: "All attendance records deleted",
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export {
    submitAttendance,
    submitAttendanceGuest,
    getAttendance,
    getAllAttendance,
    presentStudent,
    deleteAttendance,
    deleteAllAttendance,
};
