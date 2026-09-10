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

const hasUnresolvedMistakes = async (req, res) => {
  try {
    const mistake = await Mistake.findOne({
      user: req.user.id,
      resolved: false,
    }).select("_id")

    return res.status(200).json({
      hasMistakes: !!mistake,
    })
  } catch (error) {
    console.error(
      "Check Unresolved Mistakes Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

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
    const {
      question,
      userAnswer,
      correctAnswer,
    } = req.body

    if (!question || !correctAnswer) {
      return res.status(400).json({
        message:
          "Question and correct answer are required.",
      })
    }

    const prompt = `
You are an expert AI tutor helping a student understand their mistake.

Question:
${question}

Student's Answer:
${userAnswer || "No answer provided"}

Correct Answer:
${correctAnswer}

Explain the mistake clearly and simply.

Your response must include:

1. Why the student's answer is wrong.
2. Why the correct answer is correct.
3. A simple explanation of the concept.
4. One small example if useful.
5. One memory tip to avoid this mistake again.

Keep the explanation concise and beginner-friendly.
Do not use unnecessary technical jargon.
`

    const completion =
      await client.chat.completions.create({
        model: "openrouter/free",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.3,

        max_tokens: 1000,

        extra_body: {
          models: [
            "openrouter/free",
          ],
        },
      })

    const explanation =
      completion.choices?.[0]?.message?.content

    if (!explanation) {
      return res.status(502).json({
        message:
          "AI did not return an explanation.",
      })
    }

    return res.status(200).json({
      explanation,
    })
  } catch (error) {
    console.error(
      "Explain Mistake Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  saveMistake,
  getMistakes,
  resolveMistake,
  explainMistake,
  hasUnresolvedMistakes,
};