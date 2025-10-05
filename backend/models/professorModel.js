import Joi from "joi";
import mongoose from "mongoose";
let professor = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true,default:true },
    }
);

let validateProfessor = (obj) => {
    let schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(obj);
};

let professorModel = mongoose.model("Professor", professor);

export { professorModel,validateProfessor };
