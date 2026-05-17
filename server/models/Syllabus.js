const mongoose = require("mongoose")

const syllabusSchema = new mongoose.Schema(
  {
    title: {
      type: String,  
    },

    content: {
      type: String,
    },

    topics:[String],
     
    },

  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Syllabus", syllabusSchema)