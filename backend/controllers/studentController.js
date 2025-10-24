import { StudentModel, validateStudent } from "../models/studentModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let getStudents = async (req, res) => {
    try {
        let result = await StudentModel.find();
        res.json(result);
    } catch (err) {
        res.send(err.message);
    }
};

let getStudentWithAttendance = async (req, res) => {
    try {
        const { studentId } = req.query;
        const student = await StudentModel.findById(studentId)
            .select("-password")
            .populate({
                path: "attendances",
                options: { sort: { time: -1 } },
                populate: [
                    { path: "lectureId" },
                    { path: "studentId" },
                ],
            });

        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }

        res.json(student);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

let postStudent = async (req, res) => {
    try {
        // validate inputs
        let { error } = validateStudent(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        // check if email already exists
        let existing = await StudentModel.findOne({ email: req.body.email });
        if (existing) {
            return res.status(400).json({ msg: "Email already registered" });
        }

        // hash password
        let hashedPassword = bcryptjs.hashSync(req.body.password, 10);

        // save in db
        let storagePost = await StudentModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            studentCode: req.body.studentCode,
        });

        // create JWT token
        let token = jwt.sign(
            {
                id: storagePost._id,
                name: storagePost.name,
                isAdmin: storagePost.isAdmin,
            },
            process.env.SECRET_KEY,
            { expiresIn: "30d" }
        );

        res.json({
            msg: "Student created",
            data: {
                id: storagePost._id,
                name: storagePost.name,
                email: storagePost.email,
                isAdmin: storagePost.isAdmin,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// ✅ LOGIN FUNCTION
let loginStudent = async (req, res) => {
    try {
        let { email, password } = req.body;

        // check for email
        let student = await StudentModel.findOne({ email });
        if (!student) {
            return res.status(404).json({ msg: "Email not found" });
        }

        // compare password
        let isMatch = bcryptjs.compareSync(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        // generate token
        let token = jwt.sign(
            { id: student._id, name: student.name, isAdmin: student.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "30d" }
        );

        res.json({
            msg: "Login successful",
            data: {
                id: student._id,
                name: student.name,
                email: student.email,
                isAdmin: student.isAdmin,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export { getStudents, postStudent, loginStudent,getStudentWithAttendance };
