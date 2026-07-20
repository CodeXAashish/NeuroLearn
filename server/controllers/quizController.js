const client = require("../ai/openrouter")
const Mistake = require("../models/Mistake")
const QuizAttempt = require("../models/QuizAttempt")

const {
  getRecommendedDifficulty,
} = require("../helpers/difficultyHelper")

const generateQuiz = async (req, res) => {
  try {
    const { topic} = req.body

    // Get previous attempts for this topic
const attempts = await QuizAttempt.find({
  user: req.user._id,
  topic: {
    $regex: new RegExp("^" + topic + "$", "i"),
  },
})

let averagePercentage = 0

if (attempts.length > 0) {
  const totalPercentage =
    attempts.reduce(
      (sum, attempt) =>
        sum +
        (attempt.score /
          attempt.totalQuestions) *
          100,
      0
    )

  averagePercentage =
    totalPercentage / attempts.length
}

const difficulty =
  getRecommendedDifficulty(
    averagePercentage
  )

    const completion =
      await client.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: `
Generate 5 MCQs on ${topic}.

Difficulty: ${difficulty}

Return ONLY valid JSON.

Format:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswer": "Option A"
  }
]
`,
          },
        ],
      })

   const quizText =
  completion.choices[0].message.content

const quiz = JSON.parse(quizText)

  res.status(200).json({
    difficulty,
    quiz,
  })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

// NEW FUNCTION
const submitQuiz = async (req, res) => {
  try {
    const { topic, answers } = req.body
    const normalizedTopic = topic.trim().toUpperCase()
    let score = 0

    for (const answer of answers) {

  if (answer.userAnswer === answer.correctAnswer) {

    score++

    // Resolve one previous unresolved mistake
    const unresolvedMistake = await Mistake.findOne({
      user: req.user._id,
      topic: normalizedTopic,
      question: answer.question,
      resolved: false,
    })

    if (unresolvedMistake) {
      unresolvedMistake.resolved = true
      unresolvedMistake.resolvedAt = new Date()

      await unresolvedMistake.save()
    }

  } else {

    await Mistake.create({
      user: req.user._id,
      topic: normalizedTopic,
      question: answer.question,
      userAnswer: answer.userAnswer,
      correctAnswer: answer.correctAnswer,
    })

  }
}
    const attempt = await QuizAttempt.create({
      user: req.user._id,
      topic: normalizedTopic,
      score,
      totalQuestions: answers.length,
    })

    res.status(200).json({
      score,
      totalQuestions: answers.length,
      attempt,
    })
   } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  generateQuiz,
  submitQuiz,
}