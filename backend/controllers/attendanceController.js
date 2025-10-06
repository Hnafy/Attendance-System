import attendanceModel from "../models/attendanceModel.js";
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
      .find()
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
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 📘 Submit attendance
const submitAttendance = async (req, res) => {
  try {
    const { studentId, deviceId, lat, long } = req.body;
    const className = req.params.className;
    const now = new Date();

    if (!studentId || !deviceId) {
      return res.status(400).json({ message: "studentId and deviceId are required" });
    }

    // 🔹 Find the current lecture for this class
    const lecture = await lectureModel.findOne({
      className,
      startTime: { $lte: now },
      endTime: { $gte: now },
    });

    if (!lecture) {
      return res.status(400).json({ message: "you don't have any lecture now" });
    }

    // 🔹 Check if this student already attended this lecture
    const alreadyAttended = await attendanceModel.findOne({
      studentId,
      lectureId: lecture._id,
    });

    if (alreadyAttended) {
      return res.status(400).json({ message: "you already took attendance for this lecture" });
    }

    // 🔹 Determine status
    let status = "present";

    // Late (>30 minutes)
    const diffMinutes = (now - lecture.startTime) / (1000 * 60);
    if (diffMinutes > 30) status = "late";

    // Same device used before in this lecture
    const sameDevice = await attendanceModel.findOne({
      deviceId,
      lectureId: lecture._id,
    });
    if (sameDevice) status = "suspicious";

    // 🔹 Check location (optional)
    if (lat && long) {
      const uniLat = 30.41375;
      const uniLng = 30.5368817;
      // const uniLat = 30.42883; bajor
      // const uniLng = 31.03894;

      const maxDistance = 0.5; // 500 m
      const distance = getDistanceFromLatLonInKm(lat, long, uniLat, uniLng);
      if (distance > maxDistance) status = "outside";
    }

    // 🔹 Save new attendance
    const attendance = await attendanceModel.create({
      studentId,
      lectureId: lecture._id,
      className,
      status,
      deviceId,
      lat,
      long,
      time: now,
    });

    res.status(201).json({
      message: "attendance recorded successfully",
      attendance,
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

export { submitAttendance,getAttendance,getAllAttendance,presentStudent };
