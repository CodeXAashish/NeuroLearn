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

const setupStudyPlan = async (req, res) => {
  try {
    const { hoursPerDay, planningDays } = req.body

    // ========================================
    // 1. Validate input
    // ========================================

    const totalDays = Number(planningDays)
    const studyHours = Number(hoursPerDay)

    if (
      !Number.isInteger(totalDays) ||
      totalDays < 1 ||
      totalDays > 365
    ) {
      return res.status(400).json({
        message:
          "Planning duration must be between 1 and 365 days.",
      })
    }

    if (
      !Number.isFinite(studyHours) ||
      studyHours <= 0
    ) {
      return res.status(400).json({
        message:
          "Valid study hours per day are required.",
      })
    }

    // ========================================
    // 2. Get user's syllabus
    // ========================================

    const syllabus = await Syllabus.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1
    })

    if (!syllabus) {
      return res.status(404).json({
        message:
          "Please upload a syllabus first.",
      })
    }
    
    if (
      !syllabus.subjects ||
      syllabus.subjects.length === 0
    ) {
      return res.status(400).json({
        message:
          "Your syllabus does not contain any subjects.",
      })
    }

    // ========================================
    // 3. Flatten:
    //
    // Subject
    //   → Unit
    //      → Topic
    //         → Subtopic
    //
    // We use SUBTOPIC as the smallest
    // learning unit.
    // ========================================

    const learningUnits = []

    syllabus.subjects.forEach((subject) => {
      if (
        !subject.units ||
        subject.units.length === 0
      ) {
        return
      }

      subject.units.forEach((unit) => {
        if (
          !unit.topics ||
          unit.topics.length === 0
        ) {
          return
        }

        unit.topics.forEach((topic) => {
          // --------------------------------
          // Topic with subtopics
          // --------------------------------

          if (
            topic.subtopics &&
            topic.subtopics.length > 0
          ) {
            topic.subtopics.forEach(
              (subtopic) => {
                learningUnits.push({
                  subtopicId:
                    subtopic._id,

                  topicId:
                    topic._id,

                  subject:
                    subject.name,

                  unit:
                    unit.name,

                  topic:
                    topic.name,

                  name:
                    subtopic.name,

                  mastery:
                    subtopic.mastery || 0,
                })
              }
            )
          }

          // --------------------------------
          // Safety fallback
          //
          // If AI created a topic without
          // subtopics, don't lose it.
          // --------------------------------

          else {
            learningUnits.push({
              subtopicId: null,

              topicId:
                topic._id,

              subject:
                subject.name,

              unit:
                unit.name,

              topic:
                topic.name,

              name:
                topic.name,

              mastery:
                topic.mastery || 0,
            })
          }
        })
      })
    })

    // ========================================
    // 4. Validate learning units
    // ========================================

    if (learningUnits.length === 0) {
      return res.status(400).json({
        message:
          "No learning topics or subtopics were found in your syllabus.",
      })
    }

    // ========================================
    // 5. Calculate learning workload
    // ========================================
    //
    // We DO NOT use:
    //
    // topics / topicsPerDay
    //
    // Instead, every subtopic represents
    // a learning unit.
    //
    // A normal learning unit gets 1 workload
    // point.
    //
    // More complex concepts can later be
    // given greater weight.
    // ========================================

    const totalLearningUnits =
      learningUnits.length

    // ========================================
    // 6. Calculate available learning days
    // ========================================
    //
    // We reserve some time for:
    //
    // Learning
    // Revision
    // Practice
    // Final Revision
    //
    // For very short plans, learning gets
    // almost all available time.
    // ========================================

    let learningDays
    let revisionDays
    let practiceDays
    let finalRevisionDays

    if (totalDays <= 7) {
      learningDays =
        Math.max(1, totalDays - 1)

      revisionDays =
        totalDays - learningDays

      practiceDays = 0
      finalRevisionDays = 0
    }

    else if (totalDays <= 14) {
      learningDays =
        Math.max(
          1,
          Math.floor(totalDays * 0.70)
        )

      revisionDays = 1
      practiceDays =
        totalDays >= 10 ? 1 : 0

      finalRevisionDays =
        totalDays -
        learningDays -
        revisionDays -
        practiceDays
    }

    else {
      // --------------------------------
      // Normal / long plans
      //
      // Learning gets roughly 65%
      // Revision roughly 15%
      // Practice roughly 12%
      // Final revision gets the rest
      // --------------------------------

      learningDays =
        Math.floor(totalDays * 0.65)

      revisionDays =
        Math.floor(totalDays * 0.15)

      practiceDays =
        Math.floor(totalDays * 0.12)

      finalRevisionDays =
        totalDays -
        learningDays -
        revisionDays -
        practiceDays
    }

    // ========================================
    // 7. Safety corrections
    // ========================================

    learningDays =
      Math.max(1, learningDays)

    revisionDays =
      Math.max(0, revisionDays)

    practiceDays =
      Math.max(0, practiceDays)

    finalRevisionDays =
      Math.max(0, finalRevisionDays)

    // ========================================
    // 8. Make sure learning phase can contain
    // the entire syllabus
    // ========================================
    //
    // IMPORTANT:
    //
    // We calculate the workload from
    // SUBTOPICS rather than top-level topics.
    //
    // We don't want 40 subtopics to be
    // blindly pushed into 5 days.
    // ========================================

    const learningUnitsPerDay =
      totalLearningUnits /
      learningDays

    // ========================================
    // 9. Generate Learning Days
    // ========================================

    const learningPlans = []

    let learningIndex = 0

    for (
      let day = 1;
      day <= learningDays;
      day++
    ) {
      const remainingUnits =
        totalLearningUnits -
        learningIndex

      const remainingLearningDays =
        learningDays -
        day +
        1

      // Balanced distribution.
      //
      // Example:
      //
      // 40 units / 10 days
      // → 4 per day
      //
      // 41 units / 10 days
      // → 5,4,4,4...
      //
      const unitsForDay =
        Math.ceil(
          remainingUnits /
            remainingLearningDays
        )

      const dayUnits =
        learningUnits.slice(
          learningIndex,
          learningIndex +
            unitsForDay
        )

      // Group units by topic
      const topicMap = new Map()

      dayUnits.forEach((unit) => {
        const key =
          unit.topicId?.toString() ||
          unit.topic

        if (!topicMap.has(key)) {
          topicMap.set(key, {
            topicId:
              unit.topicId,

            name:
              unit.topic,

            subtopics: [],
          })
        }

        topicMap
          .get(key)
          .subtopics
          .push({
            subtopicId:
              unit.subtopicId,

            name:
              unit.name,

            mastery:
              unit.mastery,

            covered: {
              status:
                "pending",

              completedAt:
                null,
            },
          })
      })

      const topics = Array.from(
        topicMap.values()
      ).map((topic) => ({
        topicId:
          topic.topicId,

        name:
          topic.name,

        subtopics:
          topic.subtopics,

        covered: {
          status:
            "pending",

          completedAt:
            null,
        },

        quiz: {
          status:
            "pending",

          completedAt:
            null,
        },

        notes: {
          status:
            "not_required",

          completedAt:
            null,
        },

        flashcards: {
          status:
            "not_required",

          completedAt:
            null,
        },

        mistakeReview: {
          status:
            "not_required",

          completedAt:
            null,
        },

        completed: false,

        completedAt: null,
      }))

      learningPlans.push({
        day,

        phase:
          "Learning",

        topics,

        tasks: [],

        instructions: [
          "Study the assigned subtopics.",
          "Mark the covered activity after actually studying them.",
          "Complete the quiz for each topic.",
        ],

        reason:
          `Learning ${dayUnits.length} syllabus subtopics within today's available study time.`,

        completed: false,

        completedAt: null,
      })

      learningIndex +=
        unitsForDay
    }

    // ========================================
    // 10. Generate Revision Days
    // ========================================

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

      revisionPlans.push({
        day,

        phase:
          "Revision",

        topics: [],

        tasks: [
          {
            title:
              "Active recall",

            description:
              "Recall previously learned concepts without immediately looking at your notes.",

            completed: false,

            completedAt: null,
          },

          {
            title:
              "Review weak areas",

            description:
              "Focus on concepts where quiz performance or mastery is low.",

            completed: false,

            completedAt: null,
          },

          {
            title:
              "Review mistakes",

            description:
              "Re-attempt previously incorrect questions and understand why the answers were wrong.",

            completed: false,

            completedAt: null,
          },
        ],

        instructions: [
          "Do not simply reread everything.",
          "Use active recall first.",
          "Review mistakes and weak concepts.",
        ],

        reason:
          "Revision is used to strengthen previously learned material.",

        completed: false,

        completedAt: null,
      })
    }

    // ========================================
    // 11. Generate Practice Days
    // ========================================

    const practicePlans = []

    const practiceStartDay =
      revisionStartDay +
      revisionDays

    for (
      let i = 0;
      i < practiceDays;
      i++
    ) {
      const day =
        practiceStartDay + i

      practicePlans.push({
        day,

        phase:
          "Practice",

        topics: [],

        tasks: [
          {
            title:
              "Practice questions",

            description:
              "Solve questions covering previously learned concepts.",

            completed: false,

            completedAt: null,
          },

          {
            title:
              "Attempt quiz",

            description:
              "Complete a practice quiz and analyze incorrect answers.",

            completed: false,

            completedAt: null,
          },

          {
            title:
              "Review mistakes",

            description:
              "Revisit mistakes made during practice.",

            completed: false,

            completedAt: null,
          },
        ],

        instructions: [
          "Focus on applying concepts rather than rereading them.",
          "Analyze every incorrect answer.",
          "Record important mistakes for final revision.",
        ],

        reason:
          "Practice converts learned concepts into active problem-solving ability.",

        completed: false,

        completedAt: null,
      })
    }

    // ========================================
    // 12. Generate Final Revision Days
    // ========================================

    const finalRevisionPlans = []

    const finalRevisionStartDay =
      practiceStartDay +
      practiceDays

    for (
      let i = 0;
      i < finalRevisionDays;
      i++
    ) {
      const day =
        finalRevisionStartDay + i

      finalRevisionPlans.push({
        day,

        phase:
          "Final Revision",

        topics: [],

        tasks: [
          {
            title:
              "Rapid concept revision",

            description:
              "Review important concepts and high-priority weak areas.",

            completed: false,

            completedAt: null,
          },

          {
            title:
              "Final mistake review",

            description:
              "Revisit your accumulated mistakes before finishing the plan.",

            completed: false,

            completedAt: null,
          },

          {
            title:
              "Final practice",

            description:
              "Complete a final mixed quiz or practice session.",

            completed: false,

            completedAt: null,
          },
        ],

        instructions: [
          "Prioritize weak topics.",
          "Use active recall.",
          "Avoid spending excessive time rereading familiar concepts.",
        ],

        reason:
          "Final revision consolidates the syllabus before the study plan ends.",

        completed: false,

        completedAt: null,
      })
    }

    // ========================================
    // 13. Combine phases
    // ========================================

    const generatedPlans = [
      ...learningPlans,
      ...revisionPlans,
      ...practicePlans,
      ...finalRevisionPlans,
    ]

    // ========================================
    // 14. Create dates
    // ========================================

    const startDate =
      new Date()

    startDate.setHours(
      0,
      0,
      0,
      0
    )

    const dailyPlans =
      generatedPlans.map(
        (plan, index) => {
          const date =
            new Date(startDate)

          date.setDate(
            startDate.getDate() +
              index
          )

          return {
            ...plan,

            day:
              index + 1,

            date,
          }
        }
      )

    // ========================================
    // 15. Safety check
    // ========================================

    if (
      dailyPlans.length !==
      totalDays
    ) {
      return res.status(500).json({
        message:
          "Unable to generate the complete study plan.",
      })
    }

    // ========================================
    // 16. Replace old plan
    // ========================================

    await StudyPlan.deleteMany({
      user: req.user._id,
    })

    // ========================================
    // 17. Save new plan
    // ========================================

    const plan =
      await StudyPlan.create({
        user:
          req.user._id,

        planningDays:
          totalDays,

        hoursPerDay:
          studyHours,

        startDate,

        currentDay: 1,

        completedDays: [],

        dailyPlans,
      })

    // ========================================
    // 18. Response
    // ========================================

    return res.status(201).json({
      message:
        "Study plan created successfully.",

      planningDays:
        totalDays,

      hoursPerDay:
        studyHours,

      totalLearningUnits,

      learningDays,

      revisionDays,

      practiceDays,

      finalRevisionDays,

      averageLearningUnitsPerDay:
        Number(
          learningUnitsPerDay.toFixed(
            2
          )
        ),

      plan,
    })
  } catch (error) {
    console.error(
      "Setup Study Plan Error:",
      error
    )

    return res.status(500).json({
      message:
        error.message,
    })
  }
}

 // ========================
// Get Today Plan
// ========================
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
    // Entire plan completed
    // --------------------------------

    if (currentDay > totalDays) {
      return res.status(200).json({
        currentDay: totalDays,
        totalDays,
        daysLeft: 0,
        phase: "Completed",
        plan: null,
        topics: [],
        tasks: [],
        dayCompleted: true,
        progress: 100,
        completedTopics: 0,
        totalTopics: 0,
        remainingActivities: [],
        canCompleteDay: true,
        message:
          "Congratulations! You have completed your study plan.",
      })
    }

    // --------------------------------
    // Find today's scheduled plan
    // --------------------------------

    const todayPlan = studyPlan.dailyPlans.find(
      (plan) => plan.day === currentDay
    )

    if (!todayPlan) {
      return res.status(404).json({
        message:
          `Study Day ${currentDay} was not found.`,
      })
    }

    // ========================================
    // BUILD CARRY-FORWARD TOPICS
    // ========================================
    //
    // We look at previous days.
    //
    // Any topic that still has REQUIRED
    // activities pending can be carried forward.
    //
    // We do NOT carry completed topics.
    //
    // We also avoid duplicating a topic that
    // is already scheduled today.
    // ========================================

    const carryForwardTopics = []

    const todayTopicIds = new Set(
      todayPlan.topics.map(
        (topic) =>
          topic.topicId?.toString()
      )
    )

    for (
      let day = 1;
      day < currentDay;
      day++
    ) {
      const previousPlan =
        studyPlan.dailyPlans.find(
          (plan) => plan.day === day
        )

      if (!previousPlan) {
        continue
      }

      previousPlan.topics.forEach(
        (previousTopic) => {
          // --------------------------------
          // Check required activities
          // --------------------------------

          const coveredPending =
            previousTopic.covered?.status !==
            "completed"

          const quizPending =
            previousTopic.quiz?.status !==
            "completed"

          const mistakePending =
            previousTopic.mistakeReview?.status ===
            "pending"

          const topicIncomplete =
            coveredPending ||
            quizPending ||
            mistakePending

          if (!topicIncomplete) {
            return
          }

          // --------------------------------
          // Don't duplicate today's topic
          // --------------------------------

          const topicId =
            previousTopic.topicId?.toString()

          if (
            topicId &&
            todayTopicIds.has(topicId)
          ) {
            return
          }

          // --------------------------------
          // Don't add same topic twice
          // --------------------------------

          const alreadyAdded =
            carryForwardTopics.some(
              (topic) =>
                topic.topicId?.toString() ===
                topicId
            )

          if (alreadyAdded) {
            return
          }

          // --------------------------------
          // Add a copy
          // --------------------------------

          carryForwardTopics.push(
            previousTopic.toObject
              ? previousTopic.toObject()
              : previousTopic
          )
        }
      )
    }

    // ========================================
    // EFFECTIVE TODAY TOPICS
    // ========================================
    //
    // Carry-forward first.
    // Today's new topics second.
    // ========================================

    const effectiveTopics = [
      ...carryForwardTopics,
      ...todayPlan.topics,
    ]

    // ========================================
    // Calculate progress
    // ========================================

    const totalTopics =
      effectiveTopics.length

    let completedTopics = 0

    effectiveTopics.forEach(
      (topic) => {
        if (topic.completed) {
          completedTopics++
        }
      }
    )

    const progress =
      totalTopics > 0
        ? Math.round(
            (completedTopics /
              totalTopics) *
              100
          )
        : 0

    // ========================================
    // Required activities
    // ========================================

    const remainingActivities = []

    effectiveTopics.forEach(
      (topic) => {
        // -------------------------------
        // Covered — REQUIRED
        // -------------------------------

        if (
          topic.covered?.status !==
          "completed"
        ) {
          remainingActivities.push({
            topicId:
              topic.topicId,

            topic:
              topic.name,

            activity:
              "covered",
          })
        }

        // -------------------------------
        // Quiz — REQUIRED
        // -------------------------------

        if (
          topic.quiz?.status !==
          "completed"
        ) {
          remainingActivities.push({
            topicId:
              topic.topicId,

            topic:
              topic.name,

            activity:
              "quiz",
          })
        }

        // -------------------------------
        // Mistake Review
        // REQUIRED only when pending
        // -------------------------------

        if (
          topic.mistakeReview?.status ===
          "pending"
        ) {
          remainingActivities.push({
            topicId:
              topic.topicId,

            topic:
              topic.name,

            activity:
              "mistakeReview",
          })
        }
      }
    )

    // ========================================
    // Remaining days
    // ========================================

    const daysLeft =
      totalDays - currentDay

    // ========================================
    // Day can be completed only when ALL
    // required activities are complete
    // ========================================

    const canCompleteDay =
      remainingActivities.length === 0

    // ========================================
    // Return effective today's plan
    // ========================================

    return res.status(200).json({
      currentDay,

      totalDays,

      daysLeft,

      phase:
        todayPlan.phase,

      date:
        todayPlan.date,

      // Effective topics include
      // carry-forward work.
      topics:
        effectiveTopics,

      tasks:
        todayPlan.tasks || [],

      instructions:
        todayPlan.instructions || [],

      reason:
        todayPlan.reason || "",

      dayCompleted:
        todayPlan.completed,

      progress,

      completedTopics,

      totalTopics,

      carryForwardCount:
        carryForwardTopics.length,

      carryForwardTopics:
        carryForwardTopics.map(
          (topic) => ({
            topicId:
              topic.topicId,

            topic:
              topic.name,
          })
        ),

      remainingActivities,

      canCompleteDay,

      plan: {
        title:
          `Study Day ${currentDay}`,

        goal:
          todayPlan.phase ===
          "Learning"
            ? "Learn today's topics and complete required activities."
            : todayPlan.phase ===
              "Revision"
            ? "Revise weak and previously learned topics."
            : todayPlan.phase ===
              "Practice"
            ? "Practice and test your knowledge."
            : todayPlan.phase ===
              "Final Revision"
            ? "Complete your final revision."
            : "Complete today's study tasks.",
      },
    })
  } catch (error) {
    console.error(
      "Get Today Plan Error:",
      error
    )

    return res.status(500).json({
      message:
        error.message,
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

    const currentDay =
      studyPlan.currentDay || 1

    // --------------------------------
    // Check if entire plan is complete
    // --------------------------------

    if (
      currentDay >
      studyPlan.planningDays
    ) {
      return res.status(400).json({
        message:
          "All study days are already completed.",
      })
    }

    // --------------------------------
    // Find current day
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
    // Already completed?
    // --------------------------------

    if (currentPlan.completed) {
      return res.status(400).json({
        message:
          "Today's study plan is already completed.",
      })
    }

    // ========================================
    // Build effective today's topics
    // ========================================
    //
    // This includes:
    //
    // 1. Unfinished topics from previous days
    // 2. Today's newly scheduled topics
    //
    // Carry-forward topics are checked FIRST.
    // ========================================

    const effectiveTopics = []

    const addedTopicIds =
      new Set()

    // --------------------------------
    // Find unfinished previous topics
    // --------------------------------

    for (
      let day = 1;
      day < currentDay;
      day++
    ) {
      const previousPlan =
        studyPlan.dailyPlans.find(
          (plan) =>
            plan.day === day
        )

      if (!previousPlan) {
        continue
      }

      previousPlan.topics.forEach(
        (topic) => {
          // Only unfinished topics
          if (topic.completed) {
            return
          }

          const topicId =
            topic.topicId?.toString()

          // Avoid duplicates
          if (
            topicId &&
            !addedTopicIds.has(
              topicId
            )
          ) {
            effectiveTopics.push(
              topic
            )

            addedTopicIds.add(
              topicId
            )
          }
        }
      )
    }

    // --------------------------------
    // Add today's topics
    // --------------------------------

    currentPlan.topics.forEach(
      (topic) => {
        const topicId =
          topic.topicId?.toString()

        if (
          topicId &&
          !addedTopicIds.has(
            topicId
          )
        ) {
          effectiveTopics.push(
            topic
          )

          addedTopicIds.add(
            topicId
          )
        }
      }
    )

    // ========================================
    // Check required activities
    // ========================================

    const remainingActivities = []

    effectiveTopics.forEach(
      (topic) => {
        // --------------------------------
        // Covered — REQUIRED
        // --------------------------------

        if (
          topic.covered?.status !==
          "completed"
        ) {
          remainingActivities.push({
            topicId:
              topic.topicId,

            topic:
              topic.name,

            activity:
              "covered",
          })
        }

        // --------------------------------
        // Quiz — REQUIRED
        // --------------------------------

        if (
          topic.quiz?.status !==
          "completed"
        ) {
          remainingActivities.push({
            topicId:
              topic.topicId,

            topic:
              topic.name,

            activity:
              "quiz",
          })
        }

        // --------------------------------
        // Mistake Review
        //
        // Required only when pending
        // --------------------------------

        if (
          topic.mistakeReview?.status ===
          "pending"
        ) {
          remainingActivities.push({
            topicId:
              topic.topicId,

            topic:
              topic.name,

            activity:
              "mistakeReview",
          })
        }
      }
    )

    // ========================================
    // Don't allow completion
    // ========================================

    if (
      remainingActivities.length > 0
    ) {
      return res.status(400).json({
        message:
          "Today's tasks are not completed yet.",

        currentDay,

        dayCompleted: false,

        canCompleteDay: false,

        remainingActivities,
      })
    }

    // ========================================
    // Mark today's actual plan complete
    // ========================================

    currentPlan.completed =
      true

    currentPlan.completedAt =
      new Date()

    // ========================================
    // Add to completedDays
    // ========================================

    const alreadyRecorded =
      studyPlan.completedDays.some(
        (day) =>
          day.day === currentDay
      )

    if (!alreadyRecorded) {
      studyPlan.completedDays.push({
        day: currentDay,

        completedAt:
          new Date(),
      })
    }

    // ========================================
    // Advance current day
    // ========================================

    studyPlan.currentDay =
      currentDay + 1

    // ========================================
    // Save
    // ========================================

    await studyPlan.save()

    // ========================================
    // Check entire plan
    // ========================================

    const planCompleted =
      studyPlan.currentDay >
      studyPlan.planningDays

    // ========================================
    // Response
    // ========================================

    return res.status(200).json({
      message: planCompleted
        ? "Congratulations! You completed the entire study plan."
        : "Today's study plan completed successfully.",

      completedDay:
        currentDay,

      currentDay:
        studyPlan.currentDay,

      totalDays:
        studyPlan.planningDays,

      completedDays:
        studyPlan.completedDays.length,

      remainingDays:
        Math.max(
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
      message:
        error.message,
    })
  }
}

// ===============================
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
    // 5. Find the topic
    //
    // Search from the current day backwards.
    //
    // This allows a carried-forward topic
    // from Day 1 to be updated while the
    // user is currently on Day 2.
    // --------------------------------

    let topicData = null
    let sourcePlan = null

    for (
      let day = currentDay;
      day >= 1;
      day--
    ) {
      const plan =
        studyPlan.dailyPlans.find(
          (item) =>
            item.day === day
        )

      if (!plan) {
        continue
      }

      const foundTopic =
        plan.topics.find(
          (topic) =>
            topic.topicId &&
            topic.topicId.toString() ===
              topicId.toString()
        )

      if (foundTopic) {
        topicData = foundTopic
        sourcePlan = plan
        break
      }
    }

    // --------------------------------
    // 6. Topic not found
    // --------------------------------

    if (!topicData || !sourcePlan) {
      return res.status(404).json({
        message:
          "Topic not found in the study plan.",
      })
    }

    // --------------------------------
    // 7. Don't modify a completed topic
    // --------------------------------

    if (topicData.completed) {
      return res.status(400).json({
        message:
          "This topic is already completed.",
        topic: topicData,
      })
    }

    // --------------------------------
    // 8. Mistake review validation
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
    // 9. Mark activity completed
    // --------------------------------

    if (!topicData[activity]) {
      return res.status(400).json({
        message:
          `Activity '${activity}' is not available for this topic.`,
      })
    }

    topicData[activity].status =
      "completed"

    topicData[activity].completedAt =
      new Date()

    // --------------------------------
    // 10. Check topic completion
    // --------------------------------
    //
    // Required:
    // Covered
    // Quiz
    //
    // Conditional:
    // Mistake Review
    //
    // Optional:
    // Notes
    // Flashcards
    // --------------------------------

    const coveredCompleted =
      topicData.covered?.status ===
      "completed"

    const quizCompleted =
      topicData.quiz?.status ===
      "completed"

    const mistakeReviewCompleted =
      topicData.mistakeReview?.status ===
        "completed" ||
      topicData.mistakeReview?.status ===
        "not_required"

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
    // 11. Calculate EFFECTIVE today
    //
    // Include:
    // - unfinished previous topics
    // - today's topics
    // --------------------------------

    const effectiveTopics = []

    const addedTopicIds =
      new Set()

    // --------------------------------
    // Previous unfinished topics
    // --------------------------------

    for (
      let day = 1;
      day < currentDay;
      day++
    ) {
      const previousPlan =
        studyPlan.dailyPlans.find(
          (plan) =>
            plan.day === day
        )

      if (!previousPlan) {
        continue
      }

      previousPlan.topics.forEach(
        (topic) => {
          const incomplete =
            !topic.completed

          if (!incomplete) {
            return
          }

          const id =
            topic.topicId?.toString()

          if (
            id &&
            !addedTopicIds.has(id)
          ) {
            effectiveTopics.push(
              topic
            )

            addedTopicIds.add(id)
          }
        }
      )
    }

    // --------------------------------
    // Today's topics
    // --------------------------------

    const currentPlan =
      studyPlan.dailyPlans.find(
        (plan) =>
          plan.day === currentDay
      )

    if (currentPlan) {
      currentPlan.topics.forEach(
        (topic) => {
          const id =
            topic.topicId?.toString()

          if (
            id &&
            !addedTopicIds.has(id)
          ) {
            effectiveTopics.push(
              topic
            )

            addedTopicIds.add(id)
          }
        }
      )
    }

    // --------------------------------
    // 12. Calculate progress
    // --------------------------------

    const totalTopics =
      effectiveTopics.length

    const completedTopics =
      effectiveTopics.filter(
        (topic) =>
          topic.completed
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
    // 13. Find remaining required
    // activities
    // --------------------------------

    const remainingActivities = []

    effectiveTopics.forEach(
      (topic) => {
        // Covered — REQUIRED
        if (
          topic.covered?.status !==
          "completed"
        ) {
          remainingActivities.push({
            topicId:
              topic.topicId,

            topic:
              topic.name,

            activity:
              "covered",
          })
        }

        // Quiz — REQUIRED
        if (
          topic.quiz?.status !==
          "completed"
        ) {
          remainingActivities.push({
            topicId:
              topic.topicId,

            topic:
              topic.name,

            activity:
              "quiz",
          })
        }

        // Mistake Review —
        // REQUIRED only when pending
        if (
          topic.mistakeReview?.status ===
          "pending"
        ) {
          remainingActivities.push({
            topicId:
              topic.topicId,

            topic:
              topic.name,

            activity:
              "mistakeReview",
          })
        }
      }
    )

    // --------------------------------
    // 14. Save
    // --------------------------------

    await studyPlan.save()

    // --------------------------------
    // 15. Response
    // --------------------------------

    return res.status(200).json({
      message:
        "Activity completed successfully.",

      currentDay,

      sourceDay:
        sourcePlan.day,

      topic:
        topicData,

      activity,

      topicCompleted,

      dayProgress:
        progress,

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
      message:
        error.message,
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