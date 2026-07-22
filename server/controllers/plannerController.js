const client = require("../ai/openrouter")

const Mistake = require("../models/Mistake")
const StudyPlan = require("../models/StudyPlan")
const QuizAttempt = require("../models/QuizAttempt")
const Syllabus = require("../models/Syllabus")

const {
  getRecommendedDifficulty,
} = require("../helpers/difficultyHelper")

// ===============================
// Setup Study Plan
// ===============================
const setupStudyPlan = async (req, res) => {
  try {
    const { examDate, hoursPerDay } = req.body

    const syllabus = await Syllabus.findOne({
      user: req.user._id,
    })

    if (!syllabus) {
      return res.status(404).json({
        message: "Please upload a syllabus first.",
      })
    }

    await StudyPlan.deleteMany({
      user: req.user._id,
    })

    const startDate = new Date()

    const endDate = new Date(examDate)

    const totalDays =
      Math.ceil(
        (endDate - startDate) /
          (1000 * 60 * 60 * 24)
      ) + 1

    const syllabusText = syllabus.subjects
      .map(
        (subject) => `
Subject: ${subject.name}

Topics:
${subject.topics
  .map((topic) => `- ${topic.name}`)
  .join("\n")}
`
      )
      .join("\n")

    const completion =
      await client.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",

            content: `
Generate a ${totalDays}-day study plan.

Study Hours Per Day:
${hoursPerDay}

Use ONLY the syllabus below.

${syllabusText}

Return ONLY valid JSON.

Example:

[
 {
   "day":1,
   "topics":["Variables","Data Types"]
 },
 {
   "day":2,
   "topics":["Classes","Objects"]
 }
]
`,
          },
        ],
      })

    const aiPlan = JSON.parse(
      completion.choices[0].message.content
    )

    const dailyPlans = aiPlan.map((item) => {
      const date = new Date(startDate)

      date.setDate(
        startDate.getDate() + (item.day - 1)
      )

      return {
        day: item.day,
        date,
        topics: item.topics,
        completed: false,
      }
    })

    const plan = await StudyPlan.create({
      user: req.user._id,
      examDate,
      hoursPerDay,
      startDate,
      dailyPlans,
    })

    res.status(201).json({
      message: "Study plan created successfully.",
      plan,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

const getTodayPlan = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      user: req.user._id,
    })

    if (!studyPlan) {
      return res.status(404).json({
        message: "Please setup your study plan first.",
      })
    }

    const today = new Date()

    const startDate = new Date(studyPlan.startDate)
    const examDate = new Date(studyPlan.examDate)

    const currentDay =
      Math.floor(
        (today - startDate) /
          (1000 * 60 * 60 * 24)
      ) + 1

    const daysLeft = Math.max(
      Math.ceil(
        (examDate - today) /
          (1000 * 60 * 60 * 24)
      ),
      0
    )

    // Today's saved plan
    const todayPlan =
      studyPlan.dailyPlans.find(
        (plan) => plan.day === currentDay
      )

    if (!todayPlan) {
      return res.status(404).json({
        message: "No study plan found for today.",
      })
    }

    // Weak Topics
    const weakTopics =
      await Mistake.aggregate([
        {
          $match: {
            user: req.user._id,
            resolved: false,
          },
        },
        {
          $group: {
            _id: {
              $toUpper: "$topic",
            },
            mistakes: {
              $sum: 1,
            },
          },
        },
      ])

    // Quiz Attempts
    const attempts =
      await QuizAttempt.find({
        user: req.user._id,
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

    const weakTopicsText =
      weakTopics.length > 0
        ? weakTopics
            .map(
              (t) =>
                `${t._id} (${t.mistakes})`
            )
            .join(", ")
        : "None"

    const plan = `
Today's Topics:

${todayPlan.topics
  .map((topic) => `- ${topic}`)
  .join("\n")}

Recommended Quiz Difficulty:
${difficulty}

Weak Topics:
${weakTopicsText}
`

    res.status(200).json({
      currentDay,
      daysLeft,
      difficulty,
      plan,
      topics: todayPlan.topics,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

// ===============================
// Complete Today's Plan
// ===============================

const completeTodayPlan = async (
  req,
  res
) => {
  try {
    const studyPlan =
  await StudyPlan.findOne({
    user:req.user._id,
  })

    if (!studyPlan) {
      return res.status(404).json({
        message:
          "Study plan not found.",
      })
    }

    const today = new Date()

    const currentDay =
      Math.floor(
        (today -
          new Date(
            studyPlan.startDate
          )) /
          (1000 *
            60 *
            60 *
            24)
      ) + 1

    const todayPlan = studyPlan.dailyPlans.find(
  (plan) => plan.day === currentDay
)

if (!todayPlan) {
  return res.status(404).json({
    message: "No study plan found for today.",
  })
}

if (todayPlan.completed) {
  return res.status(400).json({
    message: "Today's study plan is already completed.",
  })
}

todayPlan.completed = true

if (
  !studyPlan.completedDays.some(
    (day) => day.day === currentDay
  )
) {
  studyPlan.completedDays.push({
    day: currentDay,
  })
}

await studyPlan.save()

    res.status(200).json({
      message:
        "Today's study plan marked as completed.",

      completedDays:
        studyPlan.completedDays.length,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

// ===============================
// Progress API
// ===============================

const getProgress = async (
  req,
  res
) => {
  try {
   const studyPlan =
  await StudyPlan.findOne({
    user:req.user._id,
  })
    if (!studyPlan) {
      return res.status(404).json({
        message:
          "Study plan not found.",
      })
    }

    const today = new Date()

    const startDate = new Date(
      studyPlan.startDate
    )

    const examDate = new Date(
      studyPlan.examDate
    )

    const currentDay =
      Math.floor(
        (today - startDate) /
          (1000 * 60 * 60 * 24)
      ) + 1

    const totalDays =
      Math.ceil(
        (examDate - startDate) /
          (1000 * 60 * 60 * 24)
      ) + 1

    const completedDays =
  studyPlan.dailyPlans.filter(
    (plan) => plan.completed
  ).length

    const remainingDays =
      Math.max(
        totalDays - currentDay,
        0
      )

    const completionPercentage =
      Math.round(
        (completedDays /
          totalDays) *
          100
      )

    res.status(200).json({
      currentDay,
      totalDays,
      completedDays,
      remainingDays,
      completionPercentage,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  setupStudyPlan,
  getTodayPlan,
  completeTodayPlan,
  getProgress,
}