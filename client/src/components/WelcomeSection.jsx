import { motion } from "framer-motion"
import {
  FaArrowRight,
  FaFire,
  FaCalendarAlt,
  FaBookOpen,
} from "react-icons/fa"

function WelcomeSection() {

  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  )

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
        duration: .8,
      }}
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-8 shadow-2xl"
    >

      {/* Background Glow */}

      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute left-0 bottom-0 h-40 w-40 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

        {/* Left */}

        <div>

          <div className="mb-4 flex items-center gap-3">

            <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-300">

              👋 Welcome Back

            </span>

            <span className="flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm text-orange-300">

              <FaFire />

              12 Day Streak

            </span>

          </div>

          <h1 className="text-4xl font-black text-white">

            Hello, Aashish 👋

          </h1>

          <p className="mt-3 max-w-2xl text-slate-300 leading-7">

            Continue your AI-powered learning journey.
            Complete today's tasks to improve your
            performance and stay on track for your exam.

          </p>

          <div className="mt-6 flex flex-wrap gap-4">

            <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-slate-300">

              <FaCalendarAlt className="text-cyan-400" />

              {today}

            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-slate-300">

              <FaBookOpen className="text-cyan-400" />

              Today's Goal: DBMS Revision

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

            68%

          </h2>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: "68%",
              }}
              transition={{
                duration: 1.2,
              }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            />

          </div>

          <p className="mt-4 text-sm text-slate-400">

            5 of 8 study tasks completed today.

          </p>

          <button
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:scale-[1.02] hover:bg-cyan-400"
          >

            Continue Learning

            <FaArrowRight />

          </button>

        </motion.div>

      </div>

    </motion.section>

  )

}

export default WelcomeSection