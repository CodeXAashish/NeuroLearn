const calculateDayProgress = (dayPlan) => {
  if (!dayPlan || !dayPlan.topics?.length) {
    return 0
  }

  const activities = [
    "notesCompleted",
    "quizCompleted",
    "flashcardsCompleted",
    "mistakesReviewed",
  ]

  let completedActivities = 0

  const totalActivities =
    dayPlan.topics.length * activities.length

  dayPlan.topics.forEach((topic) => {
    activities.forEach((activity) => {
      if (topic[activity]) {
        completedActivities++
      }
    })
  })

  return Math.round(
    (completedActivities / totalActivities) * 100
  )
}

module.exports = {
  calculateDayProgress,
}