const mongoose = require("mongoose")

// ===============================
// Activity Schema
// ===============================

const activitySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "completed", "not_required"],
      default: "pending",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
)

// ===============================
// Daily Topic Schema
// ===============================

const dailyTopicSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Student actually studied the topic
    covered: {
      type: activitySchema,
      default: () => ({}),
    },

    // Notes activity
    notes: {
      type: activitySchema,
      default: () => ({}),
    },

    // Flashcards activity
    flashcards: {
      type: activitySchema,
      default: () => ({}),
    },

    // Quiz activity
    quiz: {
      type: activitySchema,
      default: () => ({}),
    },

    // Mistake review
    mistakeReview: {
      type: activitySchema,
      default: () => ({
        status: "not_required",
      }),
    },

    // Overall activity completion
    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
)

// ===============================
// Study Plan Schema
// ===============================

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 30, 45, 60, 90 or custom
    planningDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },

    hoursPerDay: {
      type: Number,
      required: true,
      min: 0.5,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    currentDay: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Days fully completed
    completedDays: [
      {
        day: {
          type: Number,
          required: true,
        },

        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Complete day-by-day plan
    dailyPlans: [
      {
        day: {
          type: Number,
          required: true,
        },

        date: {
          type: Date,
          required: true,
        },

        topics: {
          type: [dailyTopicSchema],
          default: [],
        },

        phase: {
          type: [String],
          enum: [
            "Learning",
            "Revision",
            "Practice",
            "Weak Topics",
            "Final Revision",
          ],
          default: ["Learning"],
        },

        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
          default: null,
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