const client = require("../ai/openrouter")

const StudyPlan = require("../models/StudyPlan")
const Syllabus = require("../models/Syllabus")
const Mistake = require("../models/Mistake")
const QuizAttempt = require("../models/QuizAttempt")

const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body

    const [studyPlan, syllabus, mistakes, attempts] =
  await Promise.all([
    StudyPlan.findOne({ user: req.user._id }),
    Syllabus.findOne({ user: req.user._id }),
    Mistake.find({
      user: req.user._id,
      resolved: false,
    }),
    QuizAttempt.find({
      user: req.user._id,
    }),
  ])

    const subjectNames =
  syllabus?.subjects?.map((s) => s.name).join(", ") ||
  "No syllabus uploaded"


    const currentPlan =
      studyPlan?.dailyPlans.find(
        (plan) => !plan.completed
      )

    const weakTopics =
      mistakes.length > 0
        ? [...new Set(mistakes.map((m) => m.topic))]
            .join(", ")
        : "None"

    const averageScore =
      attempts.length > 0
        ? (
            attempts.reduce(
              (sum, a) =>
                sum +
                (a.score / a.totalQuestions) * 100,
              0
            ) / attempts.length
          ).toFixed(1)
        : "No quizzes attempted"

    const completion =
      await client.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content: `
You are NeuroLearn AI Tutor.

Student Context:

Current Study Day:
${currentPlan?.day || "Completed"}

Subjects:
${subjectNames}

Today's Topics:
${currentPlan?.topics?.join(", ") || "None"}

Weak Topics:
${weakTopics}

Average Quiz Score:
${averageScore}

Instructions:

- Personalize explanations.
- Prioritize today's topics.
- Help improve weak topics.
- Use beginner-friendly explanations.
- Give examples whenever possible.
- If the student asks unrelated questions, answer normally.

- Only refer to today's topics when they exist.
- Do not invent study topics that are not in the student's study plan.
- If the user asks about a future topic, answer it but mention that it is scheduled for later if applicable.
- If there is no study plan, answer normally.
- Encourage the student to think before giving the final answer.
- Ask follow-up questions when appropriate.
- Explain concepts step by step.
- When possible, relate explanations to previously studied topics.
`,
          },

          ...messages,
        ],
      })

    res.status(200).json({
      reply:
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
  chatWithAI,
}