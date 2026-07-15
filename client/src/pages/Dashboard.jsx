
import DashboardNavbar from "../components/DashboardNavbar"
import WelcomeSection from "../components/WelcomeSection"
import ContinueLearningCard from "../components/ContinueLearningCard"
import AnalyticsCards from "../components/AnalyticsCards"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"


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
  const chartData =
  analytics.weakTopics.map(
    (topic) => ({
      topic: topic._id,
      mistakes: topic.count,
    })
  )

  return (
  <div className="min-h-screen bg-[#020617] text-white">

    <DashboardNavbar />

    <main className="mx-auto max-w-7xl p-8">

      <WelcomeSection />
      
          <div className="mt-8">
               <ContinueLearningCard />
            </div>

         <div className="mt-8">

         <AnalyticsCards analytics={analytics} />

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
       {/* Weak Topics Chart */}

      <div className="bg-zinc-900 p-6 rounded-xl mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Weak Topics Chart
        </h2>

        <div
          style={{
            width: "100%",
            height: 300,
          }}
        >
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="topic" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="mistakes"
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      </main>
    </div>
  )
}

export default Dashboard