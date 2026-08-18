const Mistake = require("../models/Mistake")
const StudyPlan = require("../models/StudyPlan")
const QuizAttempt = require("../models/QuizAttempt")
const Syllabus = require("../models/Syllabus")

const {
  getRecommendedDifficulty,
} = require("../helpers/difficultyHelper")

const {
    calculateDayProgress,
} = require("../helpers/progressHelper")

// ===============================
// Setup Study Plan
// ===============================

const setupStudyPlan = async (req, res) => {
  try {
    const { hoursPerDay, planningDays } = req.body

    // --------------------------------
    // 1. Validate input
    // --------------------------------

    const totalDays = Number(planningDays)
    const studyHours = Number(hoursPerDay)

    if (!Number.isInteger(totalDays) || totalDays < 1) {
      return res.status(400).json({
        message: "Valid planning duration is required.",
      })
    }

    if (!Number.isFinite(studyHours) || studyHours <= 0) {
      return res.status(400).json({
        message: "Valid study hours per day are required.",
      })
    }

    // --------------------------------
    // 2. Get syllabus
    // --------------------------------

    const syllabus = await Syllabus.findOne({
      user: req.user._id,
    })

    if (!syllabus) {
      return res.status(404).json({
        message: "Please upload a syllabus first.",
      })
    }

    if (
      !syllabus.subjects ||
      syllabus.subjects.length === 0
    ) {
      return res.status(400).json({
        message: "Your syllabus does not contain any subjects.",
      })
    }

    // --------------------------------
    // 3. Flatten syllabus topics
    // --------------------------------
    //
    // IMPORTANT:
    // We preserve the order in which the
    // topics exist in the syllabus.
    //

    const allTopics = []

    syllabus.subjects.forEach((subject) => {
      if (!subject.topics || subject.topics.length === 0) {
        return
      }

      subject.topics.forEach((topic) => {
        allTopics.push({
          topicId: topic._id,
          name: topic.name,
          subject: subject.name,
        })
      })
    })

    if (allTopics.length === 0) {
      return res.status(400).json({
        message: "No topics were found in your syllabus.",
      })
    }

    // --------------------------------
// 4. Calculate Study Phases
// --------------------------------
//
// Learning days are based on the number
// of syllabus topics, not a percentage
// of the total planning duration.
//
// Target:
//   ~4 topics per learning day
//   Minimum: 3
//   Maximum: 5
//
// After the syllabus is completed,
// remaining days are used for:
//   Revision → Practice → Final Revision
// --------------------------------
const totalTopics = allTopics.length

const TARGET_TOPICS_PER_DAY = 3.5

let learningDays = Math.ceil(
  totalTopics / TARGET_TOPICS_PER_DAY
)

// Keep the average workload at
// approximately 3–5 topics per day.
//
// Example:
// 5 topics  → 1 day  → 5
// 6 topics  → 2 days → 3 + 3
// 8 topics  → 2 days → 4 + 4
// 10 topics → 3 days → 4 + 3 + 3
// 16 topics → 4 days → 4 + 4 + 4 + 4
if (
  totalTopics >= 3 &&
  totalTopics / learningDays < 3
) {
  learningDays -= 1
}

learningDays = Math.max(
  learningDays,
  1
)
// --------------------------------
// Make sure the selected duration
// is long enough to learn the syllabus
// --------------------------------

if (learningDays > totalDays) {
  return res.status(400).json({
    message:
      `The selected planning duration is too short. ` +
      `${totalTopics} topics require at least ` +
      `${learningDays} learning days ` +
      `(around 3–5 topics per day).`,
  })
}

// --------------------------------
// Remaining days after learning
// --------------------------------

const remainingDays =
  totalDays - learningDays

let revisionDays = 0
let practiceDays = 0
let finalRevisionDays = 0

if (remainingDays > 0) {

  // Final revision gets approximately 15%
  finalRevisionDays = Math.max(
    1,
    Math.round(
      remainingDays * 0.15
    )
  )

  // Practice gets approximately 25%
  practiceDays = Math.max(
    1,
    Math.round(
      remainingDays * 0.25
    )
  )

  // Everything else goes to revision
  revisionDays =
    remainingDays -
    practiceDays -
    finalRevisionDays

  // Safety correction
  if (revisionDays < 0) {
    revisionDays = 0
  }
}
    
 // --------------------------------
// Generate Learning Days
// --------------------------------

const learningPlans = []

let topicIndex = 0

for (
  let day = 1;
  day <= learningDays;
  day++
) {
  const remainingTopics =
    totalTopics - topicIndex

  const remainingDays =
    learningDays - day + 1

  // Balanced distribution.
  //
  // Example:
  // 16 topics / 4 days
  // → 4, 4, 4, 4
  //
  // 17 topics / 4 days
  // → 5, 4, 4, 4
  //
  // 14 topics / 4 days
  // → 4, 4, 3, 3
  //

  let topicsForDay =
    Math.ceil(
      remainingTopics /
        remainingDays
    )

  // Keep normal workload between 3–5
  // whenever mathematically possible.
  topicsForDay = Math.max(
    3,
    Math.min(
      5,
      topicsForDay
    )
  )

  // Never exceed remaining topics.
  topicsForDay = Math.min(
    topicsForDay,
    remainingTopics
  )

  const dayTopics =
    allTopics.slice(
      topicIndex,
      topicIndex + topicsForDay
    )

  learningPlans.push({
    day,

    topics: dayTopics,

    phase: ["Learning"],
  })

  topicIndex += topicsForDay
}


    // --------------------------------
    // 7. If syllabus doesn't fit inside
    // calculated learning days
    // --------------------------------
    //
    // We must not lose topics.
    //

    // --------------------------------
    // 8. Create Revision days
    // --------------------------------

    const revisionPlans = []

    const revisionStartDay =
      learningDays + 1

    for (
      let i = 0;
      i < revisionDays;
      i++
    ) {
      const day =
        revisionStartDay + i

      // Divide syllabus into revision groups.
      const groupSize = Math.max(
        1,
        Math.ceil(
          allTopics.length /
            Math.max(1, revisionDays)
        )
      )

      const startIndex =
        i * groupSize

      let revisionTopics =
        allTopics.slice(
          startIndex,
          startIndex + groupSize
        )

      // If the group calculation leaves
      // a revision day empty, use a small
      // rotating group instead.
      if (revisionTopics.length === 0) {
        const rotatingIndex =
          i % allTopics.length

        revisionTopics = [
          allTopics[rotatingIndex],
        ]
      }

      revisionPlans.push({
        day,
        topics: revisionTopics,
        phase: ["Revision"],
      })
    }

    // --------------------------------
    // 9. Create Practice days
    // --------------------------------

    const practicePlans = []

    const practiceStartDay =
      revisionStartDay + revisionDays

    // Divide topics into manageable groups
    // rather than putting the entire syllabus
    // on every practice day.

    const practiceGroupSize = Math.max(
      1,
      Math.ceil(
        allTopics.length /
          Math.max(1, practiceDays)
      )
    )

    for (
      let i = 0;
      i < practiceDays;
      i++
    ) {
      const day =
        practiceStartDay + i

      const startIndex =
        i * practiceGroupSize

      let practiceTopics =
        allTopics.slice(
          startIndex,
          startIndex + practiceGroupSize
        )

      if (practiceTopics.length === 0) {
        const rotatingIndex =
          i % allTopics.length

        practiceTopics = [
          allTopics[rotatingIndex],
        ]
      }

      practicePlans.push({
        day,
        topics: practiceTopics,
        phase: ["Practice"],
      })
    }

    // --------------------------------
    // 10. Create Final Revision days
    // --------------------------------

    const finalRevisionPlans = []

    const finalRevisionStartDay =
      practiceStartDay + practiceDays

    for (
      let i = 0;
      i < finalRevisionDays;
      i++
    ) {
      const day =
        finalRevisionStartDay + i

      let finalTopics

      if (i === finalRevisionDays - 1) {
        // Last day = complete syllabus revision
        finalTopics = [...allTopics]
      } else {
        const groupSize = Math.max(
          1,
          Math.ceil(
            allTopics.length /
              Math.max(
                1,
                finalRevisionDays
              )
          )
        )

        const startIndex =
          i * groupSize

        finalTopics =
          allTopics.slice(
            startIndex,
            startIndex + groupSize
          )

        if (finalTopics.length === 0) {
          finalTopics = [...allTopics]
        }
      }

      finalRevisionPlans.push({
        day,
        topics: finalTopics,
        phase: ["Final Revision"],
      })
    }

    // --------------------------------
    // 11. Combine all phases
    // --------------------------------

    const generatedPlans = [
      ...learningPlans,
      ...revisionPlans,
      ...practicePlans,
      ...finalRevisionPlans,
    ]

    // --------------------------------
    // 12. Make sure exactly planningDays
    // --------------------------------

    const finalPlans =
      generatedPlans
        .slice(0, totalDays)
        .map((plan, index) => ({
          ...plan,
          day: index + 1,
        }))

    // --------------------------------
    // 13. Create start date
    // --------------------------------

    const startDate = new Date()

    startDate.setHours(0, 0, 0, 0)

    // --------------------------------
    // 14. Convert into StudyPlan format
    // --------------------------------

    const dailyPlans =
      finalPlans.map((item) => {
        const date = new Date(startDate)

        date.setDate(
          startDate.getDate() +
            (item.day - 1)
        )

        const topics =
          item.topics.map((topic) => ({
            topicId: topic.topicId,

            name: topic.name,

            covered: {
              status: "pending",
              completedAt: null,
            },

            notes: {
              status: "pending",
              completedAt: null,
            },

            flashcards: {
              status: "pending",
              completedAt: null,
            },

            quiz: {
              status: "pending",
              completedAt: null,
            },

            mistakeReview: {
              status: "not_required",
              completedAt: null,
            },

            completed: false,

            completedAt: null,
          }))

        return {
          day: item.day,

          date,

          topics,

          phase: item.phase,

          completed: false,

          completedAt: null,
        }
      })

    // --------------------------------
    // 15. Replace previous plan
    // --------------------------------

    await StudyPlan.deleteMany({
      user: req.user._id,
    })

    // --------------------------------
    // 16. Save new plan
    // --------------------------------

    const plan = await StudyPlan.create({
      user: req.user._id,

      planningDays: totalDays,

      hoursPerDay: studyHours,

      startDate,

      currentDay: 1,

      completedDays: [],

      dailyPlans,
    })

    // --------------------------------
    // 17. Response
    // --------------------------------

    return res.status(201).json({
      message:
        "Study plan created successfully.",

      plan,
    })
  } 
  catch (error) {
    console.error(
      "Setup Study Plan Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

 // ========================
 //  Get Today Plan
 // ===========================
const getTodayPlan = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      user: req.user._id,
    })

    if (!studyPlan) {
      return res.status(404).json({
        message: "Please setup your study plan first.",
      })
    }

    const currentDay = studyPlan.currentDay || 1

    const totalDays = studyPlan.planningDays

    // --------------------------------
    // Check if entire plan is complete
    // --------------------------------

    if (currentDay > totalDays) {
      return res.status(200).json({
        currentDay: totalDays,
        totalDays,
        daysLeft: 0,
        phase: ["Completed"],
        plan: null,
        topics: [],
        dayCompleted: true,
        progress: 100,
        message:
          "Congratulations! You have completed your study plan.",
      })
    }

    // --------------------------------
    // Find current study day
    // --------------------------------

    const todayPlan = studyPlan.dailyPlans.find(
      (plan) => plan.day === currentDay
    )

    if (!todayPlan) {
      return res.status(404).json({
        message: `Study Day ${currentDay} was not found.`,
      })
    }

    // --------------------------------
    // Calculate today's progress
    // --------------------------------

    const totalTopics = todayPlan.topics.length

    let completedTopics = 0

    todayPlan.topics.forEach((topic) => {
      if (topic.completed) {
        completedTopics++
      }
    })

    const progress =
      totalTopics > 0
        ? Math.round(
            (completedTopics / totalTopics) * 100
          )
        : 0

    // --------------------------------
// Find remaining REQUIRED activities
// --------------------------------

const remainingActivities = []

todayPlan.topics.forEach((topic) => {

  // Covered — REQUIRED
  if (
    topic.covered?.status !== "completed"
  ) {
    remainingActivities.push({
      topicId: topic.topicId,
      topic: topic.name,
      activity: "covered",
    })
  }

  // Quiz — REQUIRED
  if (
    topic.quiz?.status !== "completed"
  ) {
    remainingActivities.push({
      topicId: topic.topicId,
      topic: topic.name,
      activity: "quiz",
    })
  }

  // Mistake Review — REQUIRED only when pending
  if (
    topic.mistakeReview?.status === "pending"
  ) {
    remainingActivities.push({
      topicId: topic.topicId,
      topic: topic.name,
      activity: "mistakeReview",
    })
  }
})

    // --------------------------------
    // Remaining days
    // --------------------------------

    const daysLeft =
      totalDays - currentDay

    // --------------------------------
    // Return today's study plan
    // --------------------------------

    return res.status(200).json({
      currentDay,

      totalDays,

      daysLeft,

      phase: todayPlan.phase,

      date: todayPlan.date,

      topics: todayPlan.topics,

      dayCompleted: todayPlan.completed,

      progress,

      completedTopics,

      totalTopics,

      remainingActivities,

      canCompleteDay:
        remainingActivities.length === 0,

      plan: {
        title: `Study Day ${currentDay}`,

        goal:
          todayPlan.phase.includes("Learning")
            ? "Learn today's topics"
            : todayPlan.phase.includes("Revision")
            ? "Revise today's topics"
            : todayPlan.phase.includes("Practice")
            ? "Practice today's topics"
            : "Final revision",
      },
    })
  } catch (error) {
    console.error(
      "Get Today Plan Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

// ===============================
// Complete Today's Plan
// ===============================

const completeTodayPlan = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      user: req.user._id,
    })

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found.",
      })
    }

    // --------------------------------
    // Get current study day
    // --------------------------------

    const currentDay = studyPlan.currentDay || 1

    // --------------------------------
    // Check if entire plan is complete
    // --------------------------------

    if (currentDay > studyPlan.planningDays) {
      return res.status(400).json({
        message: "All study days are already completed.",
      })
    }

    // --------------------------------
    // Find current day
    // --------------------------------

    const currentPlan =
      studyPlan.dailyPlans.find(
        (plan) => plan.day === currentDay
      )

    if (!currentPlan) {
      return res.status(404).json({
        message: `Study Day ${currentDay} not found.`,
      })
    }

    // --------------------------------
    // Already completed?
    // --------------------------------

    if (currentPlan.completed) {
      return res.status(400).json({
        message:
          "Today's study plan is already completed.",
      })
    }

    // --------------------------------
    // Check all required activities
    // --------------------------------

    const remainingActivities = []

    currentPlan.topics.forEach((topic) => {
      // Covered
      if (
        topic.covered?.status !== "completed"
      ) {
        remainingActivities.push({
          topicId: topic.topicId,
          topic: topic.name,
          activity: "covered",
        })
      }

      // Quiz
      if (
        topic.quiz?.status !== "completed"
      ) {
        remainingActivities.push({
          topicId: topic.topicId,
          topic: topic.name,
          activity: "quiz",
        })
      }

      // Mistake Review
      //
      // Only required when status is pending.
      // "not_required" is considered complete.
      //
      if (
        topic.mistakeReview?.status === "pending"
      ) {
        remainingActivities.push({
          topicId: topic.topicId,
          topic: topic.name,
          activity: "mistakeReview",
        })
      }
    })

    // --------------------------------
    // Don't allow day completion if
    // activities are still pending
    // --------------------------------

    if (remainingActivities.length > 0) {
      return res.status(400).json({
        message:
          "Today's tasks are not completed yet.",
        
        currentDay,

        dayCompleted: false,

        canCompleteDay: false,

        remainingActivities,
      })
    }

    // --------------------------------
    // Mark current day complete
    // --------------------------------

    currentPlan.completed = true
    currentPlan.completedAt = new Date()

    // --------------------------------
    // Add to completedDays
    // --------------------------------

    const alreadyRecorded =
      studyPlan.completedDays.some(
        (day) => day.day === currentDay
      )

    if (!alreadyRecorded) {
      studyPlan.completedDays.push({
        day: currentDay,
        completedAt: new Date(),
      })
    }

    // --------------------------------
    // Move to next study day
    // --------------------------------

    studyPlan.currentDay =
      currentDay + 1

    // --------------------------------
    // Save
    // --------------------------------

    await studyPlan.save()

    // --------------------------------
    // Check if entire plan is now complete
    // --------------------------------

    const planCompleted =
      studyPlan.currentDay >
      studyPlan.planningDays

    // --------------------------------
    // Response
    // --------------------------------

    return res.status(200).json({
      message: planCompleted
        ? "Congratulations! You completed the entire study plan."
        : "Today's study plan completed successfully.",

      completedDay: currentDay,

      currentDay: studyPlan.currentDay,

      totalDays: studyPlan.planningDays,

      completedDays:
        studyPlan.completedDays.length,

      remainingDays: Math.max(
        studyPlan.planningDays -
          studyPlan.currentDay +
          1,
        0
      ),

      planCompleted,
    })
  } catch (error) {
    console.error(
      "Complete Today's Plan Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}// ===============================
// Update Topic Activity
// ===============================

const updateTopicActivity = async (req, res) => {
  try {
    const { topicId, activity } = req.body

    // --------------------------------
    // 1. Validate input
    // --------------------------------

    if (!topicId || !activity) {
      return res.status(400).json({
        message:
          "Topic ID and activity are required.",
      })
    }

    // --------------------------------
    // 2. Allowed activities
    // --------------------------------

    const allowedActivities = [
      "covered",
      "notes",
      "flashcards",
      "quiz",
      "mistakeReview",
    ]

    if (!allowedActivities.includes(activity)) {
      return res.status(400).json({
        message: "Invalid activity.",
        allowedActivities,
      })
    }

    // --------------------------------
    // 3. Find study plan
    // --------------------------------

    const studyPlan =
      await StudyPlan.findOne({
        user: req.user._id,
      })

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found.",
      })
    }

    // --------------------------------
    // 4. Current study day
    // --------------------------------

    const currentDay =
      studyPlan.currentDay || 1

    if (
      currentDay >
      studyPlan.planningDays
    ) {
      return res.status(400).json({
        message:
          "Your entire study plan is already completed.",
      })
    }

    // --------------------------------
    // 5. Find current day
    // --------------------------------

    const currentPlan =
      studyPlan.dailyPlans.find(
        (plan) =>
          plan.day === currentDay
      )

    if (!currentPlan) {
      return res.status(404).json({
        message:
          `Study Day ${currentDay} not found.`,
      })
    }

    // --------------------------------
    // 6. Don't modify completed day
    // --------------------------------

    if (currentPlan.completed) {
      return res.status(400).json({
        message:
          "Today's study plan is already completed.",
      })
    }

    // --------------------------------
    // 7. Find topic by ID
    // --------------------------------

    const topicData =
      currentPlan.topics.find(
        (topic) =>
          topic.topicId &&
          topic.topicId.toString() ===
            topicId.toString()
      )

    if (!topicData) {
      return res.status(404).json({
        message:
          "Topic not found in today's study plan.",
      })
    }

    // --------------------------------
    // 8. Check mistake review
    // --------------------------------

    if (
      activity === "mistakeReview" &&
      topicData.mistakeReview?.status ===
        "not_required"
    ) {
      return res.status(400).json({
        message:
          "Mistake review is not required for this topic.",
      })
    }

    // --------------------------------
    // 9. Mark activity complete
    // --------------------------------

    topicData[activity].status =
      "completed"

    topicData[activity].completedAt =
      new Date()

    // --------------------------------
    // 10. Check topic completion
    // --------------------------------

    // --------------------------------
// Required activities
// --------------------------------
//
// Covered + Quiz are always required.
// Mistake Review is required only when
// its status is "pending".
//
// Notes and Flashcards are optional.
//

const coveredCompleted =
  topicData.covered?.status === "completed"

const quizCompleted =
  topicData.quiz?.status === "completed"

const mistakeReviewCompleted =
  topicData.mistakeReview?.status === "completed" ||
  topicData.mistakeReview?.status === "not_required"

const topicCompleted =
  coveredCompleted &&
  quizCompleted &&
  mistakeReviewCompleted

    topicData.completed =
      topicCompleted

    topicData.completedAt =
      topicCompleted
        ? new Date()
        : null

    // --------------------------------
    // 11. Calculate progress
    // --------------------------------

    const totalTopics =
      currentPlan.topics.length

    const completedTopics =
      currentPlan.topics.filter(
        (topic) => topic.completed
      ).length

    const progress =
      totalTopics > 0
        ? Math.round(
            (completedTopics /
              totalTopics) *
              100
          )
        : 0

    // --------------------------------
    // 12. Find remaining activities
    // --------------------------------

    const remainingActivities = []

    currentPlan.topics.forEach((topic) => {
        if (
          topic.covered?.status !== "completed"
        ) {
          remainingActivities.push({
            topicId: topic.topicId,
            topic: topic.name,
            activity: "covered",
          })
        }

        // if (
        //   topic.notes?.status !== "completed"
        // ) {
        //   remainingActivities.push({
        //     topicId: topic.topicId,
        //     topic: topic.name,
        //     activity: "notes",
        //   })
        // }

        // if (
        //   topic.flashcards?.status !==
        //   "completed"
        // ) {
        //   remainingActivities.push({
        //     topicId: topic.topicId,
        //     topic: topic.name,
        //     activity: "flashcards",
        //   })
        // }

        if (
          topic.quiz?.status !== "completed"
        ) {
          remainingActivities.push({
            topicId: topic.topicId,
            topic: topic.name,
            activity: "quiz",
          })
        }

        if (
          topic.mistakeReview?.status === "pending"
        ) {
          remainingActivities.push({
            topicId: topic.topicId,
            topic: topic.name,
            activity: "mistakeReview",
          })
        }
      }
    )

    // --------------------------------
    // 13. Save
    // --------------------------------

    await studyPlan.save()

    // --------------------------------
    // 14. Response
    // --------------------------------

    return res.status(200).json({
      message:
        "Activity completed successfully.",

      currentDay,

      topic: topicData,

      activity,

      topicCompleted,

      dayProgress: progress,

      completedTopics,

      totalTopics,

      remainingActivities,

      canCompleteDay:
        remainingActivities.length === 0,
    })
  } catch (error) {
    console.error(
      "Update Topic Activity Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

// ===============================
// Progress API
// ===============================

const getProgress = async (req, res) => {
  try {
    const studyPlan =
      await StudyPlan.findOne({
        user: req.user._id,
      })

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found.",
      })
    }

    const totalDays =
      studyPlan.planningDays

    const currentDay =
      studyPlan.currentDay || 1

    const completedDays =
      studyPlan.completedDays.length

    const remainingDays =
      Math.max(
        totalDays - completedDays,
        0
      )

    const completionPercentage =
      totalDays > 0
        ? Math.round(
            (completedDays /
              totalDays) *
              100
          )
        : 0

    return res.status(200).json({
      currentDay,
      totalDays,
      completedDays,
      remainingDays,
      completionPercentage,
    })
  } catch (error) {
    console.error(
      "Get Progress Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  setupStudyPlan,
  getTodayPlan,
  completeTodayPlan,
  updateTopicActivity,
  getProgress,
}