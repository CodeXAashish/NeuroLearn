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
- Never leave any section empty.
- Return ONLY the JSON object.
- Use simple, student-friendly language.
- The notes should be detailed enough to answer a 15–20 mark university examination question.

For every topic, include as many of the following sections as applicable:

- Definition
- Introduction
- Need or Importance
- Characteristics
- Features
- Components
- Architecture
- Working Principle
- Algorithm (if applicable)
- Flowchart Explanation (if applicable)
- Types or Classification
- Functions
- Advantages
- Disadvantages
- Applications
- Real-world Examples
- Comparison with related concepts
- Limitations
- Interview Questions
- Viva Questions
- Common Exam Questions
- Conclusion

Programming topics should additionally include:
- Syntax
- Program Explanation
- Sample Code
- Sample Input/Output
- Time Complexity
- Space Complexity

Broad topics (Operating System, DBMS, Java, Computer Networks, OOP, Data Structures, etc.) should contain at least 10–15 detailed sections.

Specific topics should contain every relevant section without adding unrelated information.

The content should be suitable for semester exams, competitive exams, interviews, and revision.
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