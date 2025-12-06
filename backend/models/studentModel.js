import Joi from "joi";
import mongoose from "mongoose";
let student = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, sparse: true }, // optional for guests
        studentCode: { type: Number, required: true, unique: true },
        password: { type: String, minlength: 6 }, // optional for guests
        isAdmin: { type: Boolean, default: false },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


student.virtual("attendances", {
    ref: "attendance",
    localField: "_id",
    foreignField: "studentId",
});

let validateStudent = (obj) => {
    let schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email(),
        studentCode: Joi.number().required(),
        password: Joi.string().min(6),
    });
    return schema.validate(obj);
};

let StudentModel = mongoose.model("Student", student);

export { StudentModel, validateStudent };
