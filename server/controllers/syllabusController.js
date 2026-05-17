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

    const syllabus = await Syllabus.create({
      title: req.file.originalname,
      content: text,
      topics,
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

module.exports = {
  uploadSyllabus,
}