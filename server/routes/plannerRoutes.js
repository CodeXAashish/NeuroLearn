const express = require("express")
const router = express.Router()

const {
  setupStudyPlan,
  getTodayPlan,
  completeTodayPlan,
  getProgress,
} = require("../controllers/plannerController")

const { protect } = require("../middleware/authMiddleware")

router.post("/setup", protect, setupStudyPlan)
router.get("/today", protect, getTodayPlan)
router.put("/complete", protect, completeTodayPlan)
router.get("/progress", protect, getProgress)

module.exports = router