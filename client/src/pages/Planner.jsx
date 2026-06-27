import { useEffect, useState } from "react"

import {
  setupStudyPlan,
  getTodayPlan,
} from "../services/plannerService"

function Planner() {
  const [examDate, setExamDate] =
    useState("")

  const [hoursPerDay, setHoursPerDay] =
    useState(3)

  const [todayPlan, setTodayPlan] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const loadTodayPlan =
    async () => {
      try {
        const data =
          await getTodayPlan()

        setTodayPlan(data)
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    loadTodayPlan()
  }, [])

  const handleSetup =
    async () => {
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
            AI Study Planner 📅
          </h1>

          <input
            type="date"
            value={examDate}
            onChange={(e) =>
              setExamDate(
                e.target.value
              )
            }
            className="w-full p-3 rounded bg-zinc-800 mb-4"
          />

          <input
            type="number"
            value={hoursPerDay}
            onChange={(e) =>
              setHoursPerDay(
                e.target.value
              )
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

        <p className="mb-3 text-lg">
          Day {todayPlan.currentDay}
        </p>

        <p className="mb-6">
          Days Remaining:
          {" "}
          {todayPlan.daysLeft}
        </p>

        <div className="whitespace-pre-wrap">
          {todayPlan.plan}
        </div>

      </div>

    </div>
  )
}

export default Planner