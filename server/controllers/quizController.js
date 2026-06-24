const client = require("../ai/openrouter")
const QuizAttempt = require("../models/QuizAttempt")
const Mistake = require("../models/Mistake")

const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body

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
      if (answer.userAnswer === answer.correctAnswer) 
        {
        score++
       } else {
                await Mistake.create({
          topic: normalizedTopic,
          question: answer.question,
          userAnswer: answer.userAnswer,
          correctAnswer: answer.correctAnswer,
        })
      }
    }

    const attempt =
      await QuizAttempt.create({
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