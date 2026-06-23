import { useEffect, useState } from "react"

import {
  getAnalytics,
} from "../services/analyticsService"

function Dashboard() {
  const [analytics, setAnalytics] =
    useState(null)

  useEffect(() => {
    const fetchAnalytics =
      async () => {
        try {
          const data =
            await getAnalytics()

          setAnalytics(data)
        } catch (error) {
          console.log(error)
        }
      }

    fetchAnalytics()
  }, [])

  if (!analytics) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        NeuroLearn Dashboard 🚀
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Total Quizzes */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">
            Total Quizzes
          </h2>

          <p className="text-4xl mt-4">
            {analytics.totalQuizzes}
          </p>
        </div>

        {/* Average Score */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">
            Average Score
          </h2>

          <p className="text-4xl mt-4">
            {analytics.averageScore}%
          </p>
        </div>

      </div>

      {/* Weak Topics */}

      <div className="bg-zinc-900 p-6 rounded-xl mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Weak Topics
        </h2>

        {analytics.weakTopics.map(
          (topic) => (
            <div
              key={topic._id}
              className="flex justify-between border-b border-zinc-700 py-2"
            >
              <span>
                {topic._id}
              </span>

              <span>
                {topic.count} mistakes
              </span>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Dashboard