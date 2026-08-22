const mongoose = require("mongoose")

// ========================================
// Subtopic
// ========================================

const subtopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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

  mastery: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
})

// ========================================
// Topic
// ========================================

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  subtopics: {
    type: [subtopicSchema],
    default: [],
  },

  completed: {
    type: Boolean,
    default: false,
  },

  completedAt: {
    type: Date,
    default: null,
  },

  mastery: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
})

// ========================================
// Unit
// ========================================

const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  topics: {
    type: [topicSchema],
    default: [],
  },

  completed: {
    type: Boolean,
    default: false,
  },

  completedAt: {
    type: Date,
    default: null,
  },
})

// ========================================
// Subject
// ========================================

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  units: {
    type: [unitSchema],
    default: [],
  },
})

// ========================================
// Syllabus
// ========================================

const syllabusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
    },

    subjects: {
      type: [subjectSchema],
      default: [],
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "Syllabus",
  syllabusSchema
)