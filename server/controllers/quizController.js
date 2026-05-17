const client = require("../ai/gemini")

const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body

    const response = await client.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        {
          role: "user",
          content: `Generate 5 ${difficulty} quiz questions about ${topic}`
        }
      ]
    })

    res.json({
      quiz: response.choices[0].message.content,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {generateQuiz}