const client = require("../ai/openrouter")
const Mistake = require("../models/Mistake")
const QuizAttempt = require("../models/QuizAttempt")
const Syllabus = require("../models/Syllabus")

const {
  getRecommendedDifficulty,
} = require("../helpers/difficultyHelper")

const generateQuiz = async (req, res) => {
  try {
    const { topic, topicId, subtopic } = req.body

    const syllabus = await Syllabus.findOne({
      user: req.user._id,
    })
     if (!syllabus) {
      return res.status(404).json({
        message: "Syllabus not found.",
      })
    }
    const syllabusTopic =
  syllabus.subjects
    .flatMap((subject) => subject.units)
    .flatMap((unit) => unit.topics)
    .find(
      (item) =>
        item._id.toString() === topicId.toString()
    )

if (!syllabusTopic) {
  return res.status(404).json({
    message:
      "The selected topic was not found in your syllabus.",
  })
}
 const subtopics =
  syllabusTopic.subtopics?.map(
    (subtopic) => subtopic.name
  ) || []

console.log("Quiz syllabus topic:", syllabusTopic.name)
console.log("Quiz syllabus subtopics:", subtopics)
console.log("Quiz requested subtopic:", subtopic)

const selectedSubtopic =
  syllabusTopic.subtopics?.find(
    (item) =>
      item.name.trim().toLowerCase() ===
      subtopic.trim().toLowerCase()
  )

if (!selectedSubtopic) {
  return res.status(404).json({
    message:
      "The selected subtopic was not found in this topic.",
  })
}

console.log(
  "SELECTED SUBTOPIC OBJECT:",
  JSON.stringify(
    selectedSubtopic,
    null,
    2
  )
)

    // Get previous attempts for this topic
    const attempts = await QuizAttempt.find({
      user: req.user._id,
      topic: {
        $regex: new RegExp(
          "^" + topic + "$",
          "i"
        ),
      },
    })

    let averagePercentage = 0

    if (attempts.length > 0) {
      const totalPercentage =
        attempts.reduce(
          (sum, attempt) =>
            sum +
            (attempt.score /
              attempt.totalQuestions) *
              100,
          0
        )

      averagePercentage =
        totalPercentage /
        attempts.length
    }

    const difficulty =
      getRecommendedDifficulty(
        averagePercentage
      )

    const completion =
  await client.chat.completions.create({
    model: "openrouter/free",

    messages: [
      {
        role: "user",
       content: `
You are a syllabus-grounded quiz generator for an AI study application.

CRITICAL SOURCE RULE:

The supplied syllabus information below is the ONLY source of truth.

You MUST NOT use external knowledge, general textbook knowledge,
training knowledge, or assumptions to add information.

PARENT TOPIC:
${syllabusTopic.name}

SELECTED SUBTOPIC:
${selectedSubtopic.name}

ALL SYLLABUS SUBTOPICS:
${subtopics.join(", ")}

STRICT RULES:

1. Generate questions ONLY about the selected subtopic:
   "${selectedSubtopic.name}"

2. The parent topic "${syllabusTopic.name}" provides context only.

3. DO NOT generate questions about other subtopics.

4. DO NOT introduce information that is not explicitly supported
   by the supplied syllabus.

5. DO NOT assume a programming language.

6. DO NOT mention C++, Java, Python, C, JavaScript, or any other
   programming language unless it is explicitly present in the
   supplied syllabus information.

7. If the supplied syllabus does not provide enough information
   to create a question, DO NOT fill the gap using general knowledge.

8. Every question must be directly traceable to the supplied
   syllabus information.

9. Difficulty: ${difficulty}

10. Generate exactly 5 MCQs.

11. Each question must have exactly 4 options.

12. Each question must have exactly one correct answer.

13. Return ONLY valid JSON.

14. Do not return markdown or code fences.

Required format:

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

    temperature: 0.3,

    max_tokens: 3000,

    extra_body: {
      models: [
        "openrouter/free",
        // fallback models will go here
      ],
    },
  })

  console.log(
  "AI CHOICE:",
  JSON.stringify(
    completion.choices?.[0],
    null,
    2
  )
)

    let quizText =
      completion.choices?.[0]?.message?.content

    if (!quizText) {
      return res.status(502).json({
        message:
          "AI did not return quiz content.",
      })
    }

    // Remove possible markdown fences
    quizText = quizText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    const quiz =
      JSON.parse(quizText)

    return res.status(200).json({
      difficulty,
      quiz,
    })
  } catch (error) {
    console.error(
      "Generate Quiz Error:",
      error
    )

    return res.status(500).json({
      message:
        error.message,
    })
  }
}

// NEW FUNCTION
const submitQuiz = async (req, res) => {
  try {
    const { topic, answers } = req.body;
    const normalizedTopic = topic.trim().toUpperCase();

    let score = 0;

    // console.log("Answers received:", answers);

    for (const answer of answers) {

      if (answer.userAnswer === answer.correctAnswer) {

        score++;

        const unresolvedMistake = await Mistake.findOne({
          user: req.user._id,
          topic: normalizedTopic,
          question: answer.question,
          resolved: false,
        });

        if (unresolvedMistake) {
          unresolvedMistake.resolved = true;
          unresolvedMistake.resolvedAt = new Date();
          await unresolvedMistake.save();
        }

      } else {

        const existingMistake = await Mistake.findOne({
          user: req.user._id,
          topic: normalizedTopic,
          question: answer.question,
          resolved: false,
        });

        if (!existingMistake) {
          const createdMistake = await Mistake.create({
            user: req.user._id,
            topic: normalizedTopic,
            question: answer.question,
            userAnswer: answer.userAnswer,
            correctAnswer: answer.correctAnswer,
          });

        //   console.log("Created:", createdMistake._id);

         } //else {

        //   console.log("Already exists:", answer.question);

        // }
      }
    }

    // ✅ This should execute AFTER processing ALL answers
    const attempt = await QuizAttempt.create({
      user: req.user._id,
      topic: normalizedTopic,
      score,
      totalQuestions: answers.length,
    });

    res.status(200).json({
      score,
      totalQuestions: answers.length,
      attempt,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  generateQuiz,
  submitQuiz,
}