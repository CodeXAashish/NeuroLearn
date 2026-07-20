const client = require("../ai/openrouter")

const Mistake = require("../models/Mistake")
const StudyPlan = require("../models/StudyPlan")
const QuizAttempt = require("../models/QuizAttempt")

const {
  getRecommendedDifficulty,
} = require("../helpers/difficultyHelper")

// ===============================
// Setup Study Plan
// ===============================

const setupStudyPlan = async (req, res) => {
  try {
    const { examDate, hoursPerDay } = req.body

    await StudyPlan.deleteMany({
     user: req.user._id,
    })

    const plan = await StudyPlan.create({
       user: req.user._id,
      examDate,
      hoursPerDay,
    })

    res.status(201).json({
      message: "Study plan setup completed.",
      plan,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

// ===============================
// Today's Study Plan
// ===============================

const getTodayPlan = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
  user: req.user._id,
})
    if (!studyPlan) {
      return res.status(404).json({
        message:
          "Please setup your study plan first.",
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

    const daysLeft = Math.ceil(
      (examDate - today) /
        (1000 * 60 * 60 * 24)
    )

    // Weak Topics
    const weakTopics =
  await Mistake.aggregate([
    {
      $match:{
        user:req.user._id,
        resolved:false,
      },
    },
    {
      $group:{
            _id: {
              $toUpper: "$topic",
            },
            mistakes: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            mistakes: -1,
          },
        },
      ])

    const topicList = weakTopics
      .map(
        (topic) =>
          `${topic._id} (${topic.mistakes} mistakes)`
      )
      .join(", ")

    // ===========================
    // Adaptive Difficulty
    // ===========================

    const attempts =
  await QuizAttempt.find({
    user:req.user._id,
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

    // ===========================
    // AI Planner
    // ===========================

    const completion =
      await client.chat.completions.create({
        model:
          "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",

            content:
              "You are NeuroLearn AI, an expert study coach.",
          },

          {
            role: "user",

            content: `
Today's Study Day: ${currentDay}

Days Remaining Until Exam: ${daysLeft}

Study Hours Available: ${studyPlan.hoursPerDay}

Recommended Quiz Difficulty: ${difficulty}

Weak Topics:

${topicList}

Generate ONLY today's study schedule.

Requirements:

1. Divide study into sessions.

2. Mention exact topics.

3. Add objectives.

4. Add practice tasks.

5. Add revision.

6. Add one motivational sentence.

Finally write exactly:

Today's Topics:
- Topic 1
- Topic 2

Do not generate tomorrow's plan.
`,
          },
        ],
      })

    res.status(200).json({
      currentDay,
      daysLeft,
      difficulty,
      plan:
        completion.choices[0].message
          .content,
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

    const alreadyCompleted =
      studyPlan.completedDays.find(
        (day) =>
          day.day === currentDay
      )

    if (alreadyCompleted) {
      return res.status(400).json({
        message:
          "Today's study plan is already completed.",
      })
    }

    studyPlan.completedDays.push({
      day: currentDay,
    })

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
      studyPlan.completedDays.length

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