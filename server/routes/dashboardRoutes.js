const express = require("express")
const router = express.Router()

const {
  protect,
} = require("../middleware/authMiddleware")

const {
  getHeroData,
  getContinueLearning,
} = require("../controllers/dashboardController")

router.get("/hero", protect, getHeroData)

router.get(
  "/continue-learning",
  protect,
  getContinueLearning
)

module.exports = router