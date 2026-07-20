const mongoose = require("mongoose")

const syllabusSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: String,

  content: String,

  subjects: [
    {
      name: String,

      topics: [
        {
          name: String,

          completed: {
            type: Boolean,
            default: false,
          },

          completedAt: Date,

          notesGenerated: {
            type: Boolean,
            default: false,
          },

          flashcardsGenerated: {
            type: Boolean,
            default: false,
          },

          quizCompleted: {
            type: Boolean,
            default: false,
          },

          mastery: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  ],

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Syllabus", syllabusSchema)