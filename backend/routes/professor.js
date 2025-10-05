import express from "express";
import { postProfessor, loginProfessor } from "../controllers/professorController.js";

let router = express.Router();

router.post("/", postProfessor);     // register professor
router.post("/login", loginProfessor); // login professor

export default router;
