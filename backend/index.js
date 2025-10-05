import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import student from './routes/student.js'
import db from './db.js'
import lecture from './routes/lecture.js'
import professor from './routes/professor.js'
import attendance from './routes/attendance.js'

// connect to database
db()
dotenv.config()

let app = express()

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://localhost:3000",
    "https://nusc-attendance.netlify.app/",
    "https://hanafy.vercel.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true
}));

app.use(express.json())


// routes
app.use('/api/students', student)
app.use('/api/lectures', lecture)
app.use('/api/professor', professor)
app.use('/api/attendance', attendance)

// app.listen(3000, () => {
//   console.log('Server started on http://localhost:3000')
// })
export default app;