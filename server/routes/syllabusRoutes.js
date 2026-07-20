const express = require("express")

const {
  protect,
} = require("../middleware/authMiddleware")

const upload = require("../middleware/uploadMiddleware")

const {
  uploadSyllabus,
  getMySyllabuses,
} = require("../controllers/syllabusController")

const router = express.Router()

router.post(
  "/upload",
  protect,
  upload.single("pdf"),
  uploadSyllabus
)

router.get(
  "/my",
  protect,
  getMySyllabuses
)

module.exports = router