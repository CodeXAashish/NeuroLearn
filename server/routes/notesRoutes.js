const express = require("express")

const {
  generateNotes,
} = require("../controllers/notesController")

const router = express.Router()

router.post("/generate", generateNotes)

module.exports = router