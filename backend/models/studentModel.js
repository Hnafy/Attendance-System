import Joi from "joi";
import mongoose from "mongoose";
let student = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        studentCode: { type: Number, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
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
        email: Joi.string().email().required(),
        studentCode: Joi.number().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(obj);
};

let StudentModel = mongoose.model("Student", student);

export { StudentModel, validateStudent };
