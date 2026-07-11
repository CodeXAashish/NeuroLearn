const client = require("../ai/openrouter")

const generateFlashcards = async (req, res) => {
  try {
    const { topic } = req.body

    const completion =
      await client.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",
            content:
              "You are an expert teacher.",
          },
          {
            role: "user",
            content: `
Generate exactly 10 flashcards on the topic "${topic}".

Return ONLY valid JSON in this format:

{
  "flashcards": [
    {
      "question": "...",
      "answer": "..."
    }
  ]
}

Do not include markdown or explanations.
`,
          },
        ],
      })

    const flashcards = JSON.parse(
      completion.choices[0].message.content
    )

    res.status(200).json(flashcards)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  generateFlashcards,
}