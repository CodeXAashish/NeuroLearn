const Mistake = require("../models/Mistake")
const QuizAttempt = require("../models/QuizAttempt")



const getDashboardAnalytics = async (req, res) => {

  try {
    const userId = req.user._id

    const totalQuizzes =
      await QuizAttempt.countDocuments({
        user: userId,
      })

    const averageScoreData = await QuizAttempt.aggregate([
  {
    $match: {
      user: userId,
    },
  },
  {
    $group: {
      _id: null,
      totalCorrect: {
        $sum: "$score",
      },
      totalQuestions: {
        $sum: "$totalQuestions",
      },
    },
  },
])

const averageScore =
  averageScoreData.length > 0 &&
  averageScoreData[0].totalQuestions > 0
    ? (
        (averageScoreData[0].totalCorrect /
          averageScoreData[0].totalQuestions) *
        100
      )
    : 0


    const weakTopics =
      await Mistake.aggregate([
        {
          $match: {
            user: userId,
            resolved: false
          },
        },
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
      averageScore: averageScore.toFixed(2),
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