import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  FaBook,
  FaRobot,
  FaChartLine,
  FaCalendarAlt,
  FaLayerGroup,
  FaBrain,
} from "react-icons/fa"

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-28">

      {/* Background Glow */}

      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

      <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[160px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center gap-20 px-8 lg:flex-row">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2"
        >

          <h1 className="text-5xl md:text-7xl font-black leading-tight">

  Learn{" "}

  <span className="text-cyan-400">
    Smarter.
  </span>

  <br />

  Build Your Future.

</h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">

            NeuroLearn is your AI-powered learning platform
            that creates personalized study plans,
            interactive quizzes, detailed notes,
            flashcards and performance analytics
            to help you learn faster and remember longer.

          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              to="/register"
              className="rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,.45)]"
            >
              Get Started →
            </Link>

            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="rounded-xl border border-slate-700 px-8 py-4 transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800"
            >
              Explore Features
            </button>

          </div>

        </motion.div>

        {/* Right */}

        <div className="relative flex w-full items-center justify-center lg:w-1/2">

          {/* Brain */}

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            className="flex h-60 w-60 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 shadow-[0_0_180px_40px_rgba(34,211,238,.35)]"
          >

            <FaBrain
              size={120}
              className="text-cyan-300"
            />

          </motion.div>

          {/* Floating Cards */}

          {[
            {
              icon: <FaBook />,
              title: "Notes",
              color: "text-cyan-400",
              position: "-left-6 top-12",
              duration: 3,
            },
            {
              icon: <FaRobot />,
              title: "AI Tutor",
              color: "text-purple-400",
              position: "right-0 top-4",
              duration: 4,
            },
            {
              icon: <FaCalendarAlt />,
              title: "Planner",
              color: "text-green-400",
              position: "-bottom-2 left-8",
              duration: 5,
            },
            {
              icon: <FaChartLine />,
              title: "Analytics",
              color: "text-yellow-400",
              position: "bottom-6 right-8",
              duration: 4,
            },
            {
              icon: <FaLayerGroup />,
              title: "Flashcards",
              color: "text-pink-400",
              position: "left-32 -top-4",
              duration: 6,
            },
          ].map((card) => (

            <motion.div
              key={card.title}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: card.duration,
              }}
              whileHover={{
                scale: 1.08,
                rotate: 2,
              }}
              className={`absolute ${card.position} rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl px-5 py-4 shadow-xl transition-all duration-300 hover:border-cyan-400`}
            >

              <div className={`${card.color} mb-2 text-xl`}>
                {card.icon}
              </div>

              <p className="text-white">
                {card.title}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  )
}

export default Hero