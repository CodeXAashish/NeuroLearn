const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getStudyContext,
} = require("../controllers/chatContextController");

const router = express.Router();

router.get("/", protect, getStudyContext);

module.exports = router;