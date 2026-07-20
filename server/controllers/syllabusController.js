const fs = require("fs")
const pdfParse = require("pdf-parse")

const Syllabus = require("../models/Syllabus")

const uploadSyllabus = async (req, res) => {
  try {
    const filePath = req.file.path

    const dataBuffer = fs.readFileSync(filePath)

    const pdfData = await pdfParse(dataBuffer)

    const text = pdfData.text

    // Simple topic extraction
    const topics = text
      .split("\n")
      .filter((line) => line.length > 5)
      .slice(0, 20)

    // Convert extracted topics into topic objects
  const formattedTopics = topics.map((topic) => ({
  name: topic.trim(),
  completed: false,
  completedAt: null,
  notesGenerated: false,
  flashcardsGenerated: false,
  quizCompleted: false,
  mastery: 0,
  }))

  const syllabus = await Syllabus.create({
  user: req.user._id,

  title: req.file.originalname,

  content: text,

  subjects: [
    {
      name: req.file.originalname.replace(".pdf", ""),
      topics: formattedTopics,
    },
  ],
  })

    res.status(201).json({
      message: "Syllabus uploaded successfully",
      syllabus,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getMySyllabuses = async (req, res) => {
  try {
    const syllabuses = await Syllabus.find({
      user: req.user._id,
    })

    res.status(200).json(syllabuses)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  uploadSyllabus,
  getMySyllabuses,
}