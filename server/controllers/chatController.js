const client = require("../ai/openrouter")

const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body

    const completion =
      await client.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",

            content:
              "You are NeuroLearn AI Tutor helping students.",
          },

          ...messages,
        ],
      })

    const reply =
      completion.choices[0].message.content

    res.status(200).json({
      reply,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  chatWithAI,
}