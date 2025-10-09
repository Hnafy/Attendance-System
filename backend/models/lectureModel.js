import Joi from "joi";
import mongoose from "mongoose";

let lecture = new mongoose.Schema(
    {
        lectureName: { type: String, required: true },
        className: { type: String, required: true },
        // startTime: { type: Date},
        // endTime: { type: Date},
    }
);

// validation
let validateLecture = (obj) => {
    let schema = Joi.object({
        lectureName: Joi.string().required(),
        className: Joi.string().required(),
        // startTime: Joi.date(),
    });
    return schema.validate(obj);
};
let validateUpdateLecture = (obj) => {
    let schema = Joi.object({
        lectureName: Joi.string(),
        className: Joi.string(),
        // startTime: Joi.date(),
    });
    return schema.validate(obj);
};

let lectureModel = mongoose.model("Lecture", lecture);

export { lectureModel, validateLecture,validateUpdateLecture };
