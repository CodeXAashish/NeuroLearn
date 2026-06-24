const express = require("express")
// const router = express.Router()
const {
    generateQuiz,
    submitQuiz,
} = require("../controllers/quizController")

const router = express.Router()

router.post("/generate", generateQuiz)
router.post("/submit", submitQuiz)

module.exports = router