import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import student from "./routes/student.js";
import db from "./db.js";
import lecture from "./routes/lecture.js";
import professor from "./routes/professor.js";
import attendance from "./routes/attendance.js";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

// connect to database
db();
dotenv.config();

let app = express();

app.set("trust proxy", 1);
// Middleware
app.use(
    cors({
        origin: [
            "https://nusc-attendance.netlify.app",
            "http://localhost:5173",
        ], // make sure link not have / at the end
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "token"],
        credentials: true,
    })
);

app.use(express.json());
app.use(helmet());
app.use(hpp());

app.use(
    rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 200,
    })
);

// routes
app.use("/api/students", student);
app.use("/api/lectures", lecture);
app.use("/api/professor", professor);
app.use("/api/attendance", attendance);

// app.listen(3000, () => {
//   console.log('Server started on http://localhost:3000')
// })
export default app;
