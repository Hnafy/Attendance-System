import { professorModel, validateProfessor } from "../models/professorModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ✅ Register professor
let postProfessor = async (req, res) => {
    try {
        // validate inputs
        let { error } = validateProfessor(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        // check if email already exists
        let existingProfessor = await professorModel.findOne({
            email: req.body.email,
        });
        if (existingProfessor) {
            return res.status(400).json({ msg: "Email already registered" });
        }

        // hash password
        let hashedPassword = bcryptjs.hashSync(req.body.password, 10);

        // save in db
        let storagePost = await professorModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
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
            msg: "Professor created",
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

// ✅ Login professor
let loginProfessor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if professor exists
        let professor = await professorModel.findOne({ email });
        if (!professor) {
            return res.status(404).json({ msg: "Email not found" });
        }

        // compare password
        let isMatch = bcryptjs.compareSync(password, professor.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        // generate token
        let token = jwt.sign(
            {
                id: professor._id,
                name: professor.name,
                isAdmin: professor.isAdmin,
            },
            process.env.SECRET_KEY,
            { expiresIn: "30d" }
        );

        res.json({
            msg: "Login successful",
            data: {
                id: professor._id,
                name: professor.name,
                email: professor.email,
                isAdmin: professor.isAdmin,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export { postProfessor, loginProfessor };
