const express = require("express")
const {
  setupStudyPlan,
  getTodayPlan,
  completeTodayPlan,
} = require("../controllers/plannerController")

const router = express.Router()

router.post("/setup", setupStudyPlan)
router.get("/today", getTodayPlan)
router.post("/complete", completeTodayPlan)

module.exports = router