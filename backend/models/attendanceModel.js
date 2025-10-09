import mongoose from "mongoose";


let attendance = mongoose.Schema({
  studentId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student",
    require:true
  },
  lectureId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Lecture",
    require:true
  },
  professorId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Professor",
  },
  status: { type: String, enum: ["present", "late", "suspicious", "outside", "absent"] ,default:"absent" },
  time: { type: Date, default: Date.now },
  deviceId:String,
  lat:Number,
  long:Number
})

export default mongoose.model("attendance", attendance);