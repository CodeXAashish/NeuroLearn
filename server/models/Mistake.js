const mongoose = require("mongoose")

const mistakeSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      topic: {
        type: String,
      },

      question: {
        type: String,
      },

      correctAnswer: {
        type: String,
      },

      userAnswer: {
        type: String,
      },
    },

    {
      timestamps: true,
    }
  )

module.exports = mongoose.model(
  "Mistake",
  mistakeSchema
)