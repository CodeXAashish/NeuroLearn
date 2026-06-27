const client = require("../ai/openrouter")
const Mistake = require("../models/Mistake")
const StudyPlan = require("../models/StudyPlan")

const setupStudyPlan = async (req, res) => {
  try {
    const { examDate, hoursPerDay } = req.body

    await StudyPlan.deleteMany({})

    const plan = await StudyPlan.create({
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

const getTodayPlan = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne()

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

    const weakTopics =
      await Mistake.aggregate([
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

    const completion =
      await client.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content:
              "You are an expert AI study planner.",
          },
          {
            role: "user",
           content: `
You are an expert AI study coach.

Today's Study Day: ${currentDay}
Days Remaining: ${daysLeft}
Study Hours Available: ${studyPlan.hoursPerDay}

Weak Topics:
${topicList}

Generate ONLY today's study schedule.

Format exactly like this:

# Today's Goal

## Session 1 (60 minutes)
Topic:
Objectives:
Practice:

## Session 2 (60 minutes)
Topic:
Objectives:
Practice:

## Revision (30 minutes)

## Motivation
Write one motivational sentence.

Do not generate future days.
`,
          },
        ],
      })

    res.json({
      currentDay,
      daysLeft,
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

const completeTodayPlan = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne()

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found.",
      })
    }

    const today = new Date()

    const currentDay =
      Math.floor(
        (today - new Date(studyPlan.startDate)) /
          (1000 * 60 * 60 * 24)
      ) + 1

    // Check if today's plan is already completed
    const alreadyCompleted =
      studyPlan.completedDays.find(
        (day) => day.day === currentDay
      )

    if (alreadyCompleted) {
      return res.status(400).json({
        message: "Today's study plan is already completed.",
      })
    }

    studyPlan.completedDays.push({
      day: currentDay,
    })

    await studyPlan.save()

    res.status(200).json({
      message: "Today's study plan marked as completed.",
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
module.exports = {
  setupStudyPlan,
  getTodayPlan,
  completeTodayPlan,
}