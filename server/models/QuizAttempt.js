const mongoose = require("mongoose")

const quizAttemptSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      topic: String,

      score: Number,

      totalQuestions: Number,
    },
    {
      timestamps: true,
    }
  )

module.exports = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema
)