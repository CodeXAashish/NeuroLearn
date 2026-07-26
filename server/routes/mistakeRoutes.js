const express = require("express");
const router = express.Router();

const {
  saveMistake,
  getMistakes,
  resolveMistake,
  explainMistake,
} = require("../controllers/mistakeController");

const { protect } = require("../middleware/authMiddleware");
router.get("/", protect, getMistakes);
router.post("/", saveMistake);
router.put("/:id/resolve", protect, resolveMistake);
router.post("/explain", protect, explainMistake);

module.exports = router;