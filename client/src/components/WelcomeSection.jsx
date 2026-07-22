import { motion } from "framer-motion"
import {
  FaArrowRight,
  FaFire,
  FaCalendarAlt,
  FaBookOpen,
} from "react-icons/fa"

import { useEffect, useState } from "react"

import { getHeroData } from "../services/dashboardService"
import { getTodayPlan } from "../services/plannerService"
import { useNavigate } from "react-router-dom"


function WelcomeSection() {
  const [heroData, setHeroData] = useState({
    streak: 0,
    progress: 0,
    completedDays: 0,
    totalDays: 0,
    currentDay: 1,
  })

  const [todayGoal, setTodayGoal] = useState("Loading...")

  const user = JSON.parse(localStorage.getItem("user") || "{}")
  
  const navigate = useNavigate()

  const userName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "Student"

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Hero Data
       const [hero, planData] = await Promise.all([
       getHeroData(),
      getTodayPlan(),
    ])

      setHeroData(hero)

        if (planData?.plan) {
          const topicsMatch = planData.plan.match(
            /Today's Topics:\s*([\s\S]*)/i
          )

          if (topicsMatch) {
            const firstTopic = topicsMatch[1]
              .split("\n")
              .find((line) =>
                line.trim().startsWith("-")
              )

            setTodayGoal(
              firstTopic
                ? firstTopic.replace("-", "").trim()
                : "Study Session"
            )
          } else {
            setTodayGoal("Study Session")
          }
        } else {
          setTodayGoal("No study plan")
        }
      } catch (error) {
        console.error(error)
        setTodayGoal("No study plan")
      }
    }

    loadDashboard()
  }, [])

  const handleContinueLearning = () => {
  if (todayGoal === "Loading...") {
    return
  }

  if (todayGoal === "No study plan") {
    navigate("/planner")
    return
  }

  navigate("/planner")
}

  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  )

  const hour = new Date().getHours()

  let greeting = "Hello"

  if (hour < 12) {
    greeting = "Good Morning"
  } else if (hour < 17) {
    greeting = "Good Afternoon"
  } else {
    greeting = "Good Evening"
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
      }}
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-8 shadow-2xl"
    >
      {/* Background Glow */}

      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        {/* Left */}

        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-300">
              👋 Welcome Back
            </span>

            <motion.span
  animate={{ scale: [1, 1.05, 1] }}
  transition={{
    repeat: Infinity,
    duration: 2.5,
  }}
  className="flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm text-orange-300"
>
              <FaFire />
              {heroData.streak} Day Streak
            </motion.span>
          </div>

          <h1 className="text-4xl font-black text-white">
            {greeting}, {userName} 👋
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
  {heroData.progress >= 80
    ? "You're in the final stretch. Finish your remaining topics and revise with confidence."
    : heroData.progress >= 50
    ? "You're making steady progress. Stay consistent and keep building your mastery."
    : "Let's build your study habit one session at a time. Consistency beats intensity."}
</p>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-slate-300">
              <FaCalendarAlt className="text-cyan-400" />
              {today}
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-slate-300">
              <FaBookOpen className="text-cyan-400" />
              Today's Goal: {todayGoal}
            </div>
          </div>
        </div>

        {/* Right */}

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6 backdrop-blur-lg lg:w-80"
        >
          <p className="text-sm text-slate-400">
            Today's Progress
          </p>

          <h2 className="mt-2 text-5xl font-black text-cyan-400">
            {heroData.progress}%
          </h2>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${heroData.progress}%`,
              }}
              transition={{
                duration: 1.2,
              }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            />
          </div>

          <p className="mt-4 text-sm text-slate-400">
            {heroData.completedDays} of{" "}
            {heroData.totalDays} Days Completed
          </p>

          <p className="mt-2 text-sm text-cyan-300">
            Day {heroData.currentDay} of{" "}
            {heroData.totalDays}
          </p>

          <button onClick={handleContinueLearning}
           disabled={todayGoal === "Loading..."}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition
        ${
           todayGoal === "Loading..."
        ? "cursor-not-allowed bg-slate-600 text-slate-300"
        : "bg-cyan-500 text-black hover:scale-[1.02] hover:bg-cyan-400"
        }`} >
         Continue Learning
        <FaArrowRight />
        </button>
        <p className="mt-4 text-sm text-slate-400">
  {heroData.progress >= 80
    ? "🔥 You're almost ready for your exam!"
    : heroData.progress >= 50
    ? "🚀 Great progress! Keep the momentum going."
    : "💡 Every study session gets you closer to your goal."}
</p>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default WelcomeSection