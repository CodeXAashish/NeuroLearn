const client = require("../ai/openrouter")
const Mistake = require("../models/Mistake")
const QuizAttempt = require("../models/QuizAttempt")
const Syllabus = require("../models/Syllabus")

const {
  getRecommendedDifficulty,
} = require("../helpers/difficultyHelper")

const generateQuiz = async (req, res) => {
  try {
    const { topic, topicId } = req.body
//     console.log("Quiz request:", {
//   topic,
//   topicId,
// })
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
You are generating a quiz strictly from a student's uploaded syllabus.

Subject topic:
${syllabusTopic.name}

Allowed syllabus subtopics:
${subtopics.join(", ")}

Generate exactly 5 multiple-choice questions.

IMPORTANT RULES:

1. Questions MUST be based only on the topic and subtopics listed above.
2. Do NOT use information from outside these syllabus topics.
3. Do NOT introduce another programming language or unrelated concepts.
4. If the topic is OOPS Concept, questions must be about the listed OOPS subtopics.
5. Difficulty: ${difficulty}
6. Make the questions educational and directly relevant to the syllabus.
7. Each question must have exactly 4 options.
8. There must be exactly one correct answer.
9. Return ONLY valid JSON.
10. Do not use markdown or code fences.

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