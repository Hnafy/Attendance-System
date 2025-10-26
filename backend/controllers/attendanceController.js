import attendanceModel from "../models/attendanceModel.js";
import attendanceSessionModel from "../models/attendanceSessionModel.js";
import {lectureModel} from "../models/lectureModel.js";


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

    if (!result) {
      return res.status(404).json({ message: "No attendance record found" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 📘 Get attendance by admin
const getAllAttendance = async (req, res) => {
  try {
    const result = await attendanceModel
      .find({professorId:req.user.id})
      .populate("studentId")
      .populate("lectureId")
      .sort({ createdAt: -1 });

    if (!result) {
      return res.status(404).json({ message: "No attendance record found" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📘 Helper: calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const toRad = deg => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

const submitAttendance = async (req, res) => {
  try {
    const { studentId, deviceId, lat, long } = req.body;
    const className = req.params.className;
    const now = new Date();

    if (!studentId || !deviceId) {
      return res.status(400).json({ message: "studentId and deviceId are required" });
    }

    // 🔹 Find the current lecture for this class
    // First, find the lecture for this class
    const lecture = await lectureModel.findOne({ className: className });
    if (!lecture) {
      return res.status(404).json({ message: "No lecture found for this class" });
    }

    // Then find an active session for this lecture
    const session = await attendanceSessionModel
      .findOne({ 
        isActive: true,
        lectureId: lecture._id
      })
      .populate("lectureId");

    if (!session) {
      return res.status(404).json({ message: "No active session for this class" });
    }

    // 🔹 Check if this student already attended this lecture
    const alreadyAttended = await attendanceModel.findOne({
      studentId,
      lectureId: session.lectureId._id,
    });

    if (alreadyAttended) {
      return res.status(400).json({ message: "You already took attendance for this lecture" });
    }

    // 🔹 Determine attendance status
    let status = "present";

    // Check if late (>30 minutes)
    const diffMinutes = (now - new Date(lecture.startTime)) / (1000 * 60);
    if (diffMinutes > 30) status = "late";

    // Check if same device used before in this lecture
    const sameDevice = await attendanceModel.findOne({
      deviceId,
      lectureId: lecture._id,
    });
    if (sameDevice) status = "suspicious";

    // 🔹 Check location (optional)
    if (lat && long) {
      const place = { lat: 30.41375, lon: 30.5368817 }; // Sadat

    const distance = getDistanceFromLatLonInKm(lat, long, place.lat, place.lon);
    const maxDistance = 1.2; // km — allows Sadat range .97 km

    if (distance >= maxDistance) {
      status = "outside";
    }
      // console.log(distance,maxDistance,distance >= maxDistance);

    }

    // 🔹 Save attendance
    const newAttendances = await attendanceModel.create({
      studentId,
      lectureId: session.lectureId._id,
      professorId: lecture.professorId,
      className,
      status,
      deviceId,
      lat,
      long,
      time: now,
    });
    // 🔹 Fetch updated attendances for this student
    const attendances = await attendanceModel
      .find({ studentId })
      .populate("studentId")
      .populate("lectureId")
      .sort({ time: -1 }); // optional: sort by newest first

    // 🔹 Respond with full array
    res.status(201).json({
      message: "Attendance recorded successfully",
      attendances,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


let presentStudent = async(req,res)=>{
  try {
          let existingAttendance = await attendanceModel.findByIdAndUpdate(req.params.id,{
              status: "present"
          }, { new: true }).populate("studentId").populate("lectureId");
          if (!existingAttendance) {
              return res.status(404).json({ msg: "Lecture not found" });
          }
  
          res.json({ msg: `The admin has marked (${existingAttendance.studentId.name}) as present.`, data: existingAttendance });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
}

let deleteAttendance = async (req, res) => {
    try {
        let existingAttendance = await attendanceModel.findByIdAndDelete(req.params.id);
        if (!existingAttendance) {
            return res.status(404).json({ msg: "attendance not found" });
        }

        res.json({ msg: "attendance Deleted", data: existingAttendance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

let deleteAllAttendance = async (req, res) => {
  try {
    const professorId = req.params.id;

    // Delete all attendance documents matching this professor
    const result = await attendanceModel.deleteMany({ professorId });

    // If no documents were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "No attendance found for this professor" });
    }

    res.json({ msg: "All attendance records deleted", deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export { submitAttendance,getAttendance,getAllAttendance,presentStudent,deleteAttendance,deleteAllAttendance };
