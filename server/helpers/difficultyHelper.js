const getRecommendedDifficulty = (
  averagePercentage
) => {
  if (averagePercentage < 40) {
    return "easy"
  }

  if (averagePercentage < 75) {
    return "medium"
  }

  return "hard"
}

module.exports = {
  getRecommendedDifficulty,
}