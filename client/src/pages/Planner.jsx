import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  setupStudyPlan,
  getTodayPlan,
} from "../services/plannerService"

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
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="bg-zinc-900 p-8 rounded-xl w-[450px]">

          <h1 className="text-3xl font-bold mb-6">
            📅 AI Study Planner
          </h1>

          <input
            type="date"
            value={examDate}
            onChange={(e) =>
              setExamDate(e.target.value)
            }
            className="w-full p-3 rounded bg-zinc-800 mb-4"
          />

          <input
            type="number"
            min="1"
            max="12"
            value={hoursPerDay}
            onChange={(e) =>
              setHoursPerDay(e.target.value)
            }
            className="w-full p-3 rounded bg-zinc-800 mb-6"
          />

          <button
            onClick={handleSetup}
            className="bg-blue-600 w-full py-3 rounded"
          >
            {loading
              ? "Saving..."
              : "Save Study Goal"}
          </button>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-4">
        📅 Today's Study Plan
      </h1>

      <div className="bg-zinc-900 p-6 rounded-xl">

        <p className="text-lg font-semibold">
          Study Day {todayPlan.currentDay}
        </p>

        <p className="mb-6">
          Days Remaining: {todayPlan.daysLeft}
        </p>

        <div className="whitespace-pre-wrap leading-8">
          {todayPlan.plan}
        </div>

      </div>

      {/* Quiz Section */}

      <div className="bg-zinc-900 p-6 rounded-xl mt-8">

        <h2 className="text-2xl font-bold mb-4">
          🎯 What did you study today?
        </h2>

        {topics.length > 0 ? (
          topics.map((topic) => (
            <button
              key={topic}
              onClick={() =>
                setSelectedTopic(topic)
              }
              className={`block w-full text-left p-3 rounded mb-3 transition ${
                selectedTopic === topic
                  ? "bg-blue-600"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {topic}
            </button>
          ))
        ) : (
          <p className="text-gray-400 mb-4">
            No topics detected.
          </p>
        )}

        <input
          type="text"
          placeholder="Or enter another topic..."
          value={selectedTopic}
          onChange={(e) =>
            setSelectedTopic(
              e.target.value
            )
          }
          className="w-full p-3 rounded bg-zinc-800 mb-4"
        />

        <button
          disabled={!selectedTopic}
          onClick={() =>
            navigate("/quiz", {
              state: {
                topic: selectedTopic,
              },
            })
          }
          className="bg-green-600 px-6 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Generate Quiz
        </button>

      </div>

    </div>
  )
}

export default Planner