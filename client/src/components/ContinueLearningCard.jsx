import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  getContinueLearning,
} from "../services/dashboardService"
import {
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa"

function ContinueLearningCard() {
  const navigate = useNavigate()

const [data, setData] = useState({
  topic: "",
  progress: 0,
  lastStudied: "",
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
      console.log(error)
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
        duration: .7,
      }}
      whileHover={{
        scale: 1.02,
      }}
      className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 backdrop-blur-xl shadow-lg"
    >

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">

            Continue Learning

          </span>

          <h2 className="mt-5 break-words text-2xl sm:text-3xl font-bold text-white">

            {data.topic}

          </h2>

          <div className="mt-3 space-y-1">
  <p className="text-slate-400">
    Last studied {data.lastStudied}
  </p>

  <p className="text-sm text-cyan-300">
    Continue where you left off and keep your learning streak alive.
  </p>
</div>

        </div>

        <motion.div
  animate={{
    y: [0, -6, 0],
  }}
  transition={{
    repeat: Infinity,
    duration: 3,
  }}
 className="self-start sm:self-auto rounded-2xl bg-cyan-500/10 p-4 sm:p-5"
>

          <FaBookOpen
            size={42}
            className="text-cyan-400"
          />

        </motion.div>

      </div>

      {/* Progress */}

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm">
  <span className="text-slate-400">
    Learning Progress
  </span>

  <span className="font-semibold text-cyan-300">
    {data.progress}%
  </span>
</div>
        <div className="h-3 rounded-full bg-slate-700">

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

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

  <div className="flex flex-wrap items-center gap-3">

    <span className="text-slate-400 text-sm">
      Status
    </span>

    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${
        data.status === "Completed"
          ? "bg-green-500/20 text-green-400"
          : "bg-yellow-500/20 text-yellow-300"
      }`}
    >
      {data.status}
    </span>

  </div>

  <button
    onClick={handleResume}
    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
  >
    Resume
    <FaArrowRight />
  </button>

</div>

    </motion.div>

  )

}

export default ContinueLearningCard