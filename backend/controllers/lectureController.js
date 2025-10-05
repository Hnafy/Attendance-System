import dotenv from "dotenv";
import { lectureModel, validateLecture, validateUpdateLecture } from "../models/lectureModel.js";
dotenv.config();

let getLectures = async (req, res) => {
    try {
        let result = await lectureModel.find();
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
            startTime: req.body.startTime, // <input type="datetime-local" name="birthDaTime">
            endTime: new Date(new Date(req.body.startTime).getTime() + 2 * 60 * 60 * 1000).toISOString(),
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
            startTime: req.body.startTime, // <input type="datetime-local" name="birthDaTime">
            endTime: new Date(new Date(req.body.startTime).getTime() + 2 * 60 * 60 * 1000).toISOString(),
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

export { getLectures, postLecture,updateLecture,deleteLecture };
