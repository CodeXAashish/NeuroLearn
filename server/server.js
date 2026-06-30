require("dotenv").config()
const express = require("express")
const cors = require("cors")


const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const syllabusRoutes = require("./routes/syllabusRoutes")
const quizRoutes = require("./routes/quizRoutes")
const chatRoutes = require("./routes/chatRoutes")
const mistakeRoutes = require("./routes/mistakeRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")
const plannerRoutes = require("./routes/plannerRoutes")

const notesRoutes = require("./routes/notesRoutes")


const app = express()
connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)

app.use("/api/syllabus", syllabusRoutes)

app.use("/api/quiz", quizRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/mistakes", mistakeRoutes)
app.use("/api/analytics",analyticsRoutes)
app.use("/api/planner", plannerRoutes)
app.use("/api/notes", notesRoutes)


app.get("/", (req, res) => {
  res.send("NeuroLearn API Running...")
})
app.get("/api/test", (req, res) => {
  res.json({
    message: "NeuroLearn API working..."
 })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

