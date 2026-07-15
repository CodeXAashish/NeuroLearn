import { motion } from "framer-motion"
import {
  FaArrowRight,
  FaBookOpen,
  FaClock,
} from "react-icons/fa"

function ContinueLearningCard() {

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

      <div className="flex items-center justify-between">

        <div>

          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">

            Continue Learning

          </span>

          <h2 className="mt-5 text-3xl font-bold text-white">

            Database Management System

          </h2>

          <p className="mt-3 text-slate-400">

            Last studied 2 hours ago

          </p>

        </div>

        <div className="rounded-2xl bg-cyan-500/10 p-5">

          <FaBookOpen
            size={42}
            className="text-cyan-400"
          />

        </div>

      </div>

      {/* Progress */}

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm text-slate-400">

          <span>Progress</span>

          <span>68%</span>

        </div>

        <div className="h-3 rounded-full bg-slate-700">

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
            className="h-full rounded-full bg-cyan-500"
          />

        </div>

      </div>

      <div className="mt-8 flex items-center justify-between">

        <div className="flex items-center gap-2 text-slate-400">

          <FaClock />

          <span>Estimated 25 min remaining</span>

        </div>

        <button
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >

          Resume

          <FaArrowRight />

        </button>

      </div>

    </motion.div>

  )

}

export default ContinueLearningCard