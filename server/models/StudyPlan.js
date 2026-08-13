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

        topics: [
          {
            name: {
              type: String,
              required: true,
            },

            notesCompleted: {
              type: Boolean,
              default: false,
            },

            quizCompleted: {
              type: Boolean,
              default: false,
            },

            flashcardsCompleted: {
              type: Boolean,
              default: false,
            },

            mistakesReviewed: {
              type: Boolean,
              default: false,
            },
          },
        ],

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