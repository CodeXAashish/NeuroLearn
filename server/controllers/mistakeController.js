const Mistake = require("../models/Mistake")

const saveMistake = async (req, res) => {
  try {
    const {
      user,
      topic,
      question,
      userAnswer,
      correctAnswer,
    } = req.body

    const mistake = await Mistake.create({
      user,
      topic,
      question,
      userAnswer,
      correctAnswer,
    })

    res.status(201).json(mistake)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  saveMistake,
}