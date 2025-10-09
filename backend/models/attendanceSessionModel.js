import mongoose from "mongoose";

const attendanceSessionSchema = new mongoose.Schema({
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  isActive: { type: Boolean, default: false },
  startTime: Date,
  endTime: Date,
});

export default mongoose.model("AttendanceSession", attendanceSessionSchema);