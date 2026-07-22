const mongoose = require("mongoose")

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    examDate: {
      type: Date,
      required: true,
    },

    hoursPerDay: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    completedDays: [
      {
        day: Number,
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dailyPlans: [
  {
    day: Number,

    date: Date,

    topics: [String],

    completed: {
      type: Boolean,
      default: false,
    },
  },
 ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "StudyPlan",
  studyPlanSchema
)