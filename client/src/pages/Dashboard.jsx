import DashboardNavbar from "../components/DashboardNavbar"
import WelcomeSection from "../components/WelcomeSection"
import ContinueLearningCard from "../components/ContinueLearningCard"
import AnalyticsCards from "../components/AnalyticsCards"
import FeatureGrid from "../components/FeatureGrid"
import { FaExclamationTriangle } from "react-icons/fa"
import { FaChartBar } from "react-icons/fa"
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
    <div className="min-h-screen bg-[#020617] p-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">

        {/* Hero Skeleton */}
        <div className="h-64 rounded-3xl bg-slate-800"></div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-800"
            />
          ))}
        </div>

        {/* Chart */}
        <div className="h-72 rounded-2xl bg-slate-800"></div>

      </div>
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
  <h2 className="mb-5 text-2xl font-bold text-white">
    Learning Overview
  </h2>

  <AnalyticsCards analytics={analytics} />
</div>
         <div className="mt-10">
  <h2 className="mb-5 text-2xl font-bold text-white">
    Quick Access
  </h2>

  <p className="mb-8 text-slate-400">
    Access your learning tools and continue studying efficiently.
  </p>

  <FeatureGrid />
</div>
        

      {/* Weak Topics */}

      <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-7 backdrop-blur-xl shadow-lg">

  <div className="mb-6 flex items-center justify-between">

    <div>
      <h2 className="text-2xl font-bold text-white">
        Weak Topics
      </h2>

      <p className="mt-1 text-slate-400">
        Topics that need more revision.
      </p>
    </div>

    <div className="rounded-2xl bg-red-500/10 p-4">
      <FaExclamationTriangle
        className="text-3xl text-red-400"
      />
    </div>

  </div>

  <div className="space-y-4">

    {analytics.weakTopics.map((topic) => (

      <div
        key={topic._id}
        className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/50 p-4 transition hover:border-red-400/40"
      >

        <div>
          <h3 className="font-semibold text-white">
            {topic._id}
          </h3>

          <p className="text-sm text-slate-400">
            Needs additional practice
          </p>
        </div>

        <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-semibold text-red-300">
          {topic.count} mistakes
        </span>

      </div>

    ))}

  </div>

</div>
       {/* Weak Topics Chart */}
<div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-7 backdrop-blur-xl shadow-lg">

  <div className="mb-6 flex items-center justify-between">

    <div>
      <h2 className="text-2xl font-bold text-white">
        Weak Topics Analysis
      </h2>

      <p className="mt-1 text-slate-400">
        Visualize where you make the most mistakes.
      </p>
    </div>

    <div className="rounded-2xl bg-cyan-500/10 p-4">
      <FaChartBar className="text-3xl text-cyan-400" />
    </div>

  </div>

  <div className="h-[350px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 10,
        }}
      >
        <XAxis
          dataKey="topic"
          stroke="#94a3b8"
        />

        <YAxis stroke="#94a3b8" />

        <Tooltip
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "12px",
            color: "#fff",
          }}
        />

        <Bar
          dataKey="mistakes"
          fill="#06b6d4"
          radius={[8, 8, 0, 0]}
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