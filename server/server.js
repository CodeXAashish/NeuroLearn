const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")

const syllabusRoutes = require("./routes/syllabusRoutes")

const quizRoutes = require("./routes/quizRoutes")

const app = express()
connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)

app.use("/api/syllabus", syllabusRoutes)

app.use("/api/quiz", quizRoutes)

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

