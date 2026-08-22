import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  getContinueLearning,
} from "../services/dashboardService"

import {
  FaArrowRight,
  FaBookOpen,
  FaCheck,
} from "react-icons/fa"

function ContinueLearningCard() {
  const navigate = useNavigate()

  const [data, setData] = useState({
    topic: "",
    previousDay: null,
    previousTopics: [],
    currentDay: null,
    currentTopics: [],
    progress: 0,
    status: "",
    nextRoute: "/planner",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const response =
          await getContinueLearning()

        setData(response)
      } catch (error) {
        console.error(
          "Continue Learning Error:",
          error
        )
      }
    }

    loadData()
  }, [])

  const handleResume = () => {
    navigate(data.nextRoute)
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      whileHover={{
        scale: 1.01,
      }}
      className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl sm:p-7"
    >

      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0">

          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">
            Continue Learning
          </span>

          <h2 className="mt-5 break-words text-2xl font-bold text-white sm:text-3xl">
            {data.topic || "Today's Study"}
          </h2>

          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Review what you studied previously and continue with today's topics.
          </p>

        </div>

        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
          className="self-start rounded-2xl bg-cyan-500/10 p-4 sm:self-auto sm:p-5"
        >
          <FaBookOpen
            size={42}
            className="text-cyan-400"
          />
        </motion.div>

      </div>

      {/* ================================= */}
      {/* Previous + Current Study */}
      {/* ================================= */}

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* ================================= */}
        {/* Previous Study */}
        {/* ================================= */}

        {data.previousDay && (
          <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-green-500/10 p-3">
                <FaCheck className="text-green-400" />
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Previous Study
                </p>

                <h3 className="font-semibold text-white">
                  Day {data.previousDay}
                </h3>
              </div>

            </div>

            <div className="mt-5 space-y-3">

              {data.previousTopics.length > 0 ? (
                data.previousTopics.map(
                  (topic, index) => (
                    <div
                      key={`${topic.name}-${index}`}
                      className="rounded-xl bg-slate-900/70 p-4"
                    >

                      <h4 className="font-semibold text-white">
                        📚 {topic.name}
                      </h4>

                      {topic.subtopics?.length > 0 && (
                        <div className="mt-3 space-y-2">

                          {topic.subtopics.map(
                            (subtopic, subIndex) => (
                              <div
                                key={`${subtopic}-${subIndex}`}
                                className="flex items-center gap-2 text-sm text-slate-400"
                              >
                                <FaCheck className="shrink-0 text-green-400" />

                                <span>
                                  {subtopic}
                                </span>
                              </div>
                            )
                          )}

                        </div>
                      )}

                    </div>
                  )
                )
              ) : (
                <p className="text-sm text-slate-500">
                  No previous study data available.
                </p>
              )}

            </div>

          </div>
        )}

        {/* ================================= */}
        {/* Today's Focus */}
        {/* ================================= */}

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-cyan-500/10 p-3">
              <FaBookOpen className="text-cyan-400" />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Today's Focus
              </p>

              <h3 className="font-semibold text-white">
                Day {data.currentDay}
              </h3>
            </div>

          </div>

          <div className="mt-5 space-y-3">

            {data.currentTopics.length > 0 ? (
              data.currentTopics.map(
                (topic, index) => (
                  <div
                    key={`${topic.name}-${index}`}
                    className="rounded-xl bg-slate-900/70 p-4"
                  >

                    <h4 className="font-semibold text-white">
                      📚 {topic.name}
                    </h4>

                    {topic.subtopics?.length > 0 && (
                      <div className="mt-3 space-y-2">

                        {topic.subtopics.map(
                          (subtopic, subIndex) => (
                            <div
                              key={`${subtopic}-${subIndex}`}
                              className="flex items-center gap-2 text-sm text-slate-300"
                            >
                              <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />

                              <span>
                                {subtopic}
                              </span>
                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>
                )
              )
            ) : (
              <p className="text-sm text-slate-500">
                No topics assigned for today.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* Progress */}
      {/* ================================= */}

      <div className="mt-7">

        <div className="mb-2 flex justify-between text-sm">

          <span className="text-slate-400">
            Today's Progress
          </span>

          <span className="font-semibold text-cyan-300">
            {data.progress}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-700">

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${data.progress}%`,
            }}
            transition={{
              duration: 1.2,
            }}
            className="h-full rounded-full bg-cyan-500"
          />

        </div>

      </div>

      {/* ================================= */}
      {/* Status + Resume */}
      {/* ================================= */}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex flex-wrap items-center gap-3">

          <span className="text-sm text-slate-400">
            Status
          </span>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${
              data.status === "Completed"
                ? "bg-green-500/20 text-green-400"
                : data.status === "In Progress"
                ? "bg-cyan-500/20 text-cyan-300"
                : "bg-yellow-500/20 text-yellow-300"
            }`}
          >
            {data.status}
          </span>

        </div>

        <button
          onClick={handleResume}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 sm:w-auto"
        >
          Resume
          <FaArrowRight />
        </button>

      </div>

    </motion.div>
  )
}

export default ContinueLearningCard