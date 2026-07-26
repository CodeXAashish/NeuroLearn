const StudyPlan = require("../models/StudyPlan");
const Mistake = require("../models/Mistake");
const QuizAttempt = require("../models/QuizAttempt");


const getStudyContext = async (req, res) => {
  try {
    const userId = req.user._id;

   const studyPlan = await StudyPlan.findOne({
  user: userId,
});
const currentPlan = studyPlan.dailyPlans.find(
  (plan) => !plan.completed
);
const mistakes = await Mistake.find({
  user: userId,
}).select("topic");
const weakTopics = [...new Set(mistakes.map((m) => m.topic))];

if (!studyPlan) {
  return res.status(404).json({
    message: "Study plan not found",
  });
}

res.status(200).json({
  currentDay: currentPlan?.day || null,
  todayTopics: currentPlan?.topics || [],
  weakTopics,
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStudyContext,
};