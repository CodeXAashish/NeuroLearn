import { motion } from "framer-motion"
import { Link } from "react-router-dom"

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-28">

      {/* Background Glow */}

      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

      <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[180px]" />

      <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[150px]" />

      {/* Content */}

      <div className="relative mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center gap-16 px-8 lg:flex-row">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2"
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight">

            Learn{" "}

            <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.5)]">
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
              className="rounded-xl border border-slate-700 px-8 py-4 text-white transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800"
            >
              Explore Features
            </button>

          </div>
        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -12, 0],
            scale: [1, 1.02, 1],
            rotate: [0, 0.4, 0, -0.4, 0],
          }}
          transition={{
            opacity: {
              duration: 0.8,
            },
            x: {
              duration: 0.8,
            },
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          whileHover={{
            scale: 1.03,
          }}
          className="flex w-full justify-center lg:w-1/2"
        >
          <img
            src="/images/hero-ai.png"
            alt="NeuroLearn AI"
            draggable="false"
            className="w-[600px] md:w-[780px] object-contain select-none drop-shadow-[0_0_70px_rgba(34,211,238,.45)]"
          />
        </motion.div>

      </div>

    </section>
  )
}

export default Hero