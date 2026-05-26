const client = require("../ai/openrouter")

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

For each question provide:
1. Question
2. 4 Options
3. Correct Answer
4. Short Explanation
            `,
          },
        ],
      })

    const quiz =
      completion.choices[0].message.content

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

module.exports = {
  generateQuiz,
}