const StudyPlan = require("../models/StudyPlan")
const client = require("../ai/openrouter")

const {
    calculateDayProgress,
} = require("../helpers/progressHelper")


const getHeroData = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      user: req.user._id,
    })

    if (!studyPlan) {
      return res.json({
        streak: 0,
        progress: 0,
        completedDays: 0,
        totalDays: 0,
        currentDay: 1,
      })
    }

    const totalDays = studyPlan.dailyPlans.length

const nextPlan = studyPlan.dailyPlans.find(
  (plan) => !plan.completed
)

const currentDay = nextPlan
  ? nextPlan.day
  : totalDays

    const completedDays =
      studyPlan.completedDays.length

    const progress =
      totalDays > 0
        ? Math.round(
            (completedDays / totalDays) * 100
          )
        : 0

    res.json({
      streak: completedDays,
      progress,
      completedDays,
      totalDays,
      currentDay,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
const getContinueLearning = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      user: req.user._id,
    })

    if (!studyPlan) {
      return res.json({
        topic: "No Study Plan",
        progress: 0,
        lastStudied: "Never",
        estimatedTime: 0,
        status: "Not Started",
        nextRoute: "/planner",
      })
    }

    const todayPlan = studyPlan.dailyPlans.find(
      (plan) => !plan.completed
    )

    if (!todayPlan) {
      return res.json({
        topic: "Study Plan Completed",
        progress: 100,
        lastStudied: "Completed",
        estimatedTime: 0,
        status: "Completed",
        nextRoute: "/dashboard",
      })
    }

    const progress = calculateDayProgress(todayPlan)

    const topicNames = todayPlan.topics
      .map((topic) => topic.name)
      .join(", ")

    res.json({
      topic: topicNames,
      progress,
      lastStudied: "Today",
      estimatedTime: 0,
      status:
        progress === 100
          ? "Completed"
          : progress > 0
          ? "In Progress"
          : "Not Started",
      nextRoute: "/planner",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
module.exports = {
  getHeroData,
  getContinueLearning,
}