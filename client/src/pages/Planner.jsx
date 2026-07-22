import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {motion} from "framer-motion"

import {
  setupStudyPlan,
  getTodayPlan,
  completeTodayPlan,
} from "../services/plannerService"
import {
  BookOpen,
  Target,
  AlertTriangle,
} from "lucide-react"

function Planner() {
  const navigate = useNavigate()

  // Setup States
  const [examDate, setExamDate] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState(3)

  // Planner States
  const [todayPlan, setTodayPlan] = useState(null)
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState("")
  const [loading, setLoading] = useState(false)


  // Load Today's Study Plan
  const loadTodayPlan = async () => {
    try {
      const data = await getTodayPlan()

      setTodayPlan(data)

      // Extract topics from AI response
      const lines = data.plan.split("\n")

      const topicIndex = lines.findIndex((line) =>
        line.includes("Today's Topics")
      )

      if (topicIndex !== -1) {
        const extractedTopics = lines
          .slice(topicIndex + 1)
          .filter((line) => line.trim().startsWith("-"))
          .map((line) =>
            line.replace("-", "").trim()
          )

        setTopics(extractedTopics)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadTodayPlan()
  }, [])

  // Save Study Goal
  const handleSetup = async () => {
    try {
      setLoading(true)

      await setupStudyPlan({
        examDate,
        hoursPerDay,
      })

      await loadTodayPlan()

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // First Time Setup
  if (!todayPlan) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📅</div>

          <h1 className="text-4xl font-bold">
            Create Study Plan
          </h1>

          <p className="text-zinc-400 mt-3">
            Tell NeuroLearn about your exam and
            daily study time to generate a
            personalized roadmap.
          </p>
        </div>

        {/* Exam Date */}

        <div className="mb-6">
          <label className="block mb-2 text-sm text-zinc-400">
            Exam Date
          </label>

          <input
            type="date"
            value={examDate}
            onChange={(e) =>
              setExamDate(e.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Study Hours */}

        <div className="mb-8">
          <label className="block mb-2 text-sm text-zinc-400">
            Study Hours Per Day
          </label>

          <input
            type="number"
            min="1"
            max="12"
            value={hoursPerDay}
            onChange={(e) =>
              setHoursPerDay(e.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-semibold transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading
            ? "Creating Study Plan..."
            : "🚀 Generate My Study Plan"}
        </button>

      </div>

    </div>
  )
}
  const handleComplete = async () => {
  try {
    await completeTodayPlan()

    alert("🎉 Today's study plan completed!")

    navigate("/dashboard")
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Unable to complete today's plan."
    )
  }
}
const lines = todayPlan.plan.split("\n")

let difficulty = ""
let weakTopics = ""

let mode = ""

lines.forEach((line) => {
  const text = line.trim()

  if (text.startsWith("Recommended Quiz Difficulty")) {
    mode = "difficulty"
    return
  }

  if (text.startsWith("Weak Topics")) {
    mode = "weak"
    return
  }

  if (!text) return

  if (mode === "difficulty") {
    difficulty = text
  }

  if (mode === "weak") {
    weakTopics = text
  }
})
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.4 }}
       className="min-h-screen bg-black text-white p-10">

      <div className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl">

     <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">

     <div>
      <h1 className="text-4xl font-bold">
        📅 Study Planner
      </h1>

      <p className="text-blue-100 mt-2">
        Stay consistent and achieve your exam goals.
      </p>
    </div>
    <div className="mt-6">
  <div className="flex justify-between text-sm text-zinc-300 mb-2">
    <span>Study Progress</span>
    <span>
      Day {todayPlan.currentDay} of {todayPlan.currentDay + todayPlan.daysLeft}
    </span>
  </div>

  <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-700"
      style={{
        width: `${(todayPlan.currentDay / (todayPlan.currentDay + todayPlan.daysLeft)) * 100}%`,
      }}
    />
  </div>
</div>

    <div className="grid grid-cols-2 gap-4">

      <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
        <p className="text-sm text-blue-100">
          Current Day
        </p>

        <h2 className="text-2xl font-bold">
          {todayPlan.currentDay}
        </h2>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
        <p className="text-sm text-blue-100">
          Days Left
        </p>

        <h2 className="text-2xl font-bold">
          {todayPlan.daysLeft}
        </h2>
      </div>

    </div>

  </div>

</div>
<div className="grid gap-4 md:grid-cols-3 mb-8">

  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
    <p className="text-zinc-400 text-sm">
      📅 Current Day
    </p>

    <h2 className="text-3xl font-bold mt-2">
      {todayPlan.currentDay}
    </h2>
  </div>

  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
    <p className="text-zinc-400 text-sm">
      ⏳ Days Remaining
    </p>

    <h2 className="text-3xl font-bold mt-2">
      {todayPlan.daysLeft}
    </h2>
  </div>

  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
    <p className="text-zinc-400 text-sm">
      🎯 Difficulty
    </p>

    <h2 className="text-3xl font-bold mt-2 capitalize">
      {difficulty}
    </h2>
  </div>

</div>

<div className="bg-zinc-900 rounded-2xl p-6 shadow-lg">

       <div className="space-y-6">

  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold">
        📖 Today's Study Plan
      </h2>

      <p className="text-zinc-400 mt-1">
        Complete today's tasks to stay on schedule.
      </p>
    </div>

    <span className="bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
      Day {todayPlan.currentDay}
    </span>
  </div>

  <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
    <div className="space-y-6">

  {/* Topics */}
  <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
    <h3 className="text-xl font-semibold mb-4">
      📚 Today's Topics
    </h3>

    <ul className="space-y-3">
      {topics.map((topic, index) => (
        <li
          key={index}
          className="bg-zinc-900 rounded-lg p-3"
        >
          {topic}
        </li>
      ))}
    </ul>
  </div>

  {/* Difficulty */}
  <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
    <h3 className="text-xl font-semibold mb-3">
      🎯 Recommended Difficulty
    </h3>

    <span className="bg-red-600 px-4 py-2 rounded-full">
      {difficulty}
    </span>
  </div>

  {/* Weak Topics */}
  <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
    <h3 className="text-xl font-semibold mb-3">
      ⚠ Weak Topics
    </h3>

    <p>
      {weakTopics === "None"
        ? "🎉 No weak topics!"
        : weakTopics}
    </p>
  </div>

</div>
  </div>

  <button
    onClick={handleComplete}
    className="
w-full
rounded-2xl
bg-gradient-to-r
from-green-500
to-emerald-600
py-4
text-lg
font-semibold
transition-all
duration-300
hover:scale-[1.02]
hover:shadow-xl
active:scale-95
"
  >
    ✅ Complete Today's Plan
  </button>

</div>

      </div>

      {/* Quiz Section */}

      <div className="bg-zinc-900 p-6 rounded-xl mt-8">

        <h2 className="text-2xl font-bold mb-4">
          🎯 What did you study today?
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
  {topics.length > 0 ? (
    topics.map((topic) => (
      <button
        key={topic}
        onClick={() => setSelectedTopic(topic)}
        className={`rounded-xl border p-4 text-left transition-all duration-200 ${
          selectedTopic === topic
            ? "border-blue-500 bg-blue-600/20 shadow-lg"
            : "border-zinc-700 bg-zinc-800 hover:border-blue-400 hover:-translate-y-1"
        }`}
      >
        <h3 className="font-semibold text-lg">
          📚 {topic}
        </h3>

        <p className="text-sm text-zinc-400 mt-2">
          Click to generate a quiz for this topic.
        </p>
      </button>
    ))
  ) : (
    <p className="text-gray-400">
      No topics detected.
    </p>
  )}
</div>

        <div className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-6">

  <h3 className="text-xl font-bold mb-2">
    🎯 Ready for a Quiz?
  </h3>

  <p className="text-zinc-400 mb-5">
    Select a topic above or enter your own topic to test your understanding.
  </p>

  <input
    type="text"
    placeholder="Enter another topic..."
    value={selectedTopic}
    onChange={(e) => setSelectedTopic(e.target.value)}
    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 focus:border-blue-500 focus:outline-none mb-5"
  />

  <button
    disabled={!selectedTopic}
    onClick={() =>
      navigate("/quiz", {
        state: {
          topic: selectedTopic,
          difficulty,
          source: "planner",
        },
      })
    }
    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
  >
    🚀 Generate AI Quiz
  </button>

</div>

      </div>

    
    </motion.div>
  )
  
}

export default Planner