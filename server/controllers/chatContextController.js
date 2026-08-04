const StudyPlan = require("../models/StudyPlan");
const Mistake = require("../models/Mistake");

const getStudyContext = async (req, res) => {
  try {
    const userId = req.user._id;

    const studyPlan = await StudyPlan.findOne({
      user: userId,
    });

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found",
      });
    }

    const currentPlan = studyPlan.dailyPlans.find(
      (plan) => !plan.completed
    );

    const mistakes = await Mistake.find({
      user: userId,
      resolved: false,
    }).select("topic");

    const weakTopics = [
      ...new Set(mistakes.map((m) => m.topic)),
    ];

    return res.status(200).json({
      currentDay: currentPlan?.day || null,
      todayTopics: currentPlan?.topics || [],
      weakTopics,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStudyContext,
};