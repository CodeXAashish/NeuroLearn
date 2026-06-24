const Mistake = require("../models/Mistake")
const QuizAttempt = require("../models/QuizAttempt")

const getDashboardAnalytics = async (
  req,
  res
) => {
  try {
    // Total quizzes
    const totalQuizzes =
      await QuizAttempt.countDocuments()

    // Average score
    const averageScoreData =
      await QuizAttempt.aggregate([
        {
          $group: {
            _id: null,
            averageScore: {
              $avg: "$score",
            },
          },
        },
      ])

    const averageScore =
      averageScoreData.length > 0
        ? averageScoreData[0].averageScore
        : 0

    // Weak topics
    const weakTopics =
      await Mistake.aggregate([
        {
          $group: {
            _id: {
                $toUpper: "$topic",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 5,
        },
      ])

    res.status(200).json({
      totalQuizzes,
      averageScore:
        averageScore.toFixed(2),
      weakTopics,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  getDashboardAnalytics,
}