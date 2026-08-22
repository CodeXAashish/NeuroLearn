const StudyPlan = require("../models/StudyPlan")
const client = require("../ai/openrouter")

const {
  calculateDayProgress,
} = require("../helpers/progressHelper")

// ========================================
// Get Hero Data
// ========================================

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

    const totalDays =
      studyPlan.dailyPlans.length

    // Current study day is the source of truth
    const currentDay =
      studyPlan.currentDay || 1

    const completedDays =
      studyPlan.completedDays.length

    const progress =
      totalDays > 0
        ? Math.round(
            (completedDays / totalDays) * 100
          )
        : 0

    return res.json({
      streak: completedDays,
      progress,
      completedDays,
      totalDays,
      currentDay,
    })
  } catch (error) {
    console.error(
      "Get Hero Data Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

// ========================================
// Get Continue Learning
// ========================================

const getContinueLearning = async (req, res) => {
  try {
    const studyPlan =
      await StudyPlan.findOne({
        user: req.user._id,
      })

    // --------------------------------
    // No study plan
    // --------------------------------

    if (!studyPlan) {
      return res.json({
        topic: "No Study Plan",

        previousDay: null,
        previousTopics: [],

        currentDay: null,
        currentTopics: [],

        progress: 0,
        status: "Not Started",

        nextRoute: "/planner",
      })
    }

    // --------------------------------
    // Current study day
    // --------------------------------

    const currentDay =
      studyPlan.currentDay || 1

    // --------------------------------
    // Entire plan completed
    // --------------------------------

    if (
      currentDay >
      studyPlan.planningDays
    ) {
      return res.json({
        topic: "Study Plan Completed",

        previousDay:
          studyPlan.planningDays,

        previousTopics: [],

        currentDay:
          studyPlan.planningDays,

        currentTopics: [],

        progress: 100,

        status: "Completed",

        nextRoute: "/dashboard",
      })
    }

    // --------------------------------
    // Current day plan
    // --------------------------------

    const todayPlan =
      studyPlan.dailyPlans.find(
        (plan) =>
          plan.day === currentDay
      )

    if (!todayPlan) {
      return res.status(404).json({
        message:
          `Study Day ${currentDay} not found.`,
      })
    }

    // --------------------------------
    // Previous study day
    // --------------------------------

    const previousDay =
      currentDay > 1
        ? currentDay - 1
        : null

    const previousPlan =
      previousDay
        ? studyPlan.dailyPlans.find(
            (plan) =>
              plan.day === previousDay
          )
        : null

    // --------------------------------
    // Previous topics
    // --------------------------------

    const previousTopics =
      previousPlan?.topics?.map(
        (topic) => ({
          name: topic.name,

          subtopics:
            topic.subtopics
              ?.map(
                (subtopic) =>
                  subtopic.name
              )
              .filter(Boolean) || [],

          completed:
            topic.completed,
        })
      ) || []

    // --------------------------------
    // Current topics
    // --------------------------------

    const currentTopics =
      todayPlan.topics?.map(
        (topic) => ({
          name: topic.name,

          subtopics:
            topic.subtopics
              ?.map(
                (subtopic) =>
                  subtopic.name
              )
              .filter(Boolean) || [],

          completed:
            topic.completed,
        })
      ) || []

    // --------------------------------
    // Current day progress
    // --------------------------------

    const progress =
      calculateDayProgress(
        todayPlan
      )

    // --------------------------------
    // Current topic names
    // --------------------------------

    const topicNames =
      currentTopics
        .map(
          (topic) =>
            topic.name
        )
        .filter(Boolean)

    // --------------------------------
    // Status
    // --------------------------------

    const status =
      todayPlan.completed
        ? "Completed"
        : progress > 0
        ? "In Progress"
        : "Not Started"

    // --------------------------------
    // Response
    // --------------------------------

    return res.json({
      topic:
        topicNames.length > 0
          ? topicNames.join(", ")
          : "Today's Study",

      previousDay,

      previousTopics,

      currentDay,

      currentTopics,

      progress,

      status,

      nextRoute: "/planner",
    })
  } catch (error) {
    console.error(
      "Get Continue Learning Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

// ========================================
// Exports
// ========================================

module.exports = {
  getHeroData,
  getContinueLearning,
}