const express = require("express")

const upload = require("../middleware/uploadMiddleware")

const {
  uploadSyllabus,
} = require("../controllers/syllabusController")

const router = express.Router()

router.post(
  "/upload",
  upload.single("pdf"),
  uploadSyllabus
)

module.exports = router