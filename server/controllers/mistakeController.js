const Mistake = require("../models/Mistake")
const client = require("../ai/openrouter");

const saveMistake = async (req, res) => {
  try {
    const {
      user,
      topic,
      question,
      userAnswer,
      correctAnswer,
    } = req.body
    const normalizedTopic =
    topic.trim().toUpperCase()


    const mistake = await Mistake.create({
      user,
      topic: normalizedTopic,
      question,
      userAnswer,
      correctAnswer,
    })

    res.status(201).json(mistake)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
const getMistakes = async (req, res) => {
  try {
    const mistakes = await Mistake.find({
      user: req.user.id,
      resolved: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(mistakes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const resolveMistake = async (req, res) => {
  try {
    const mistake = await Mistake.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!mistake) {
      return res.status(404).json({
        message: "Mistake not found",
      });
    }

    mistake.resolved = true;
    mistake.resolvedAt = new Date();

    await mistake.save();

    res.status(200).json({
      message: "Mistake resolved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const explainMistake = async (req, res) => {
  try {
    const { question, userAnswer, correctAnswer } = req.body;

    const prompt = `
You are an expert tutor.

Question:
${question}

Student's Answer:
${userAnswer}

Correct Answer:
${correctAnswer}

Explain:
1. Why the student's answer is incorrect.
2. Why the correct answer is correct.
3. Give a simple explanation.
4. Give one memory tip to avoid this mistake.
`;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.status(200).json({
      explanation: completion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveMistake,
  getMistakes,
  resolveMistake,
  explainMistake,
};