const client = require("../ai/openrouter")

const generateNotes = async (req, res) => {
  try {
    const { topic, type } = req.body

    const completion =
      await client.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content:
              "You are an expert university professor.",
          },
          {
            role: "user",
            content: `
Generate ${type} notes on:

${topic}

Requirements:

• Easy to understand
• Well formatted
• Use headings
• Use bullet points
• Include examples
• If possible include diagrams using text
• Suitable for university exams
`,
          },
        ],
      })

    res.status(200).json({
      notes:
        completion.choices[0].message.content,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  generateNotes,
}