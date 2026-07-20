const express = require("express")
const router = express.Router()

const {
  protect,
} = require("../middleware/authMiddleware")

const {
  getHeroData,
} = require("../controllers/dashboardController")

router.get("/hero", protect, getHeroData)

module.exports = router