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
    content: `You are an expert educational content generator.

Always return ONLY valid JSON.

Never return Markdown.

Never return plain text.

Follow the JSON schema exactly.`
  },
  {
    role: "user",
    content: `
Generate ${type} notes for the topic: "${topic}".

The notes must focus ONLY on the given topic.

Return ONLY valid JSON.

JSON Schema:

{
  "title": "",
  "introduction": "",
  "sections": [
    {
      "heading": "",
      "content": ""
    }
  ],
  "importantExamPoints": [],
  "quickRevision": []
}

Rules:

- Always fill every field.
- Never leave sections empty.
- For broad topics (Operating System, DBMS, Java), create at least 8 sections.
- For specific topics (Types of Operating System, Deadlock, Binary Search), create sections specific to that topic.
- Do not return anything except the JSON object.
`
  }
],
      })

    res.status(200).json({
      notes:
        completion.choices[0].message.content,
    })
  } catch (error) {
  console.error("Full Error:", error);

  if (error.response) {
    console.error("Response:", error.response.data);
  }

  res.status(500).json({
    message: error.message,
  });
}
}

module.exports = {
  generateNotes,
}