const StudyPlan = require("../models/StudyPlan")

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

    const today = new Date()

    const startDate = new Date(studyPlan.startDate)
    const examDate = new Date(studyPlan.examDate)

    const totalDays =
      Math.ceil(
        (examDate - startDate) /
          (1000 * 60 * 60 * 24)
      ) + 1

    const currentDay = Math.max(
      Math.floor(
        (today - startDate) /
          (1000 * 60 * 60 * 24)
      ) + 1,
      1
    )

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

module.exports = {
  getHeroData,
}