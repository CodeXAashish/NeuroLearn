const express = require("express")

const {
  saveMistake,
} = require("../controllers/mistakeController")

const router = express.Router()

router.post("/", saveMistake)

module.exports = router