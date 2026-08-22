const mongoose = require("mongoose")

// ========================================
// Activity Schema
// ========================================

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

// ========================================
// Daily Subtopic Schema
// ========================================

const dailySubtopicSchema = new mongoose.Schema(
  {
    subtopicId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    covered: {
      type: activitySchema,
      default: () => ({}),
    },

    mastery: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
)

// ========================================
// Daily Topic Schema
// ========================================

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

    subtopics: {
      type: [dailySubtopicSchema],
      default: [],
    },

    // -------------------------------
    // Required activities
    // -------------------------------

    covered: {
      type: activitySchema,
      default: () => ({}),
    },

    quiz: {
      type: activitySchema,
      default: () => ({}),
    },

    // -------------------------------
    // Optional activities
    // -------------------------------

    notes: {
      type: activitySchema,
      default: () => ({
        status: "not_required",
      }),
    },

    flashcards: {
      type: activitySchema,
      default: () => ({
        status: "not_required",
      }),
    },

    // -------------------------------
    // Required only when mistakes exist
    // -------------------------------

    mistakeReview: {
      type: activitySchema,
      default: () => ({
        status: "not_required",
      }),
    },

    // -------------------------------
    // Overall topic completion
    // -------------------------------

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

// ========================================
// Daily Task Schema
// ========================================

const dailyTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
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
  { _id: false }
)

// ========================================
// Daily Plan Schema
// ========================================

const dailyPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    // -------------------------------
    // Phase
    // -------------------------------

    phase: {
      type: String,

      enum: [
        "Learning",
        "Revision",
        "Practice",
        "Weak Topics",
        "Final Revision",
      ],

      default: "Learning",
    },

    // -------------------------------
    // Topics for this day
    // -------------------------------

    topics: {
      type: [dailyTopicSchema],
      default: [],
    },

    // -------------------------------
    // General tasks
    // Useful for Revision / Practice
    // -------------------------------

    tasks: {
      type: [dailyTaskSchema],
      default: [],
    },

    // -------------------------------
    // AI-generated daily instructions
    // -------------------------------

    instructions: {
      type: [String],
      default: [],
    },

    // -------------------------------
    // Why these topics were selected
    // Especially useful for Revision
    // -------------------------------

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    // -------------------------------
    // Overall day completion
    // -------------------------------

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

// ========================================
// Study Plan Schema
// ========================================

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

    // ====================================
    // Fully completed days
    // ====================================

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

    // ====================================
    // Complete roadmap
    // ====================================

    dailyPlans: {
      type: [dailyPlanSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "StudyPlan",
  studyPlanSchema
)