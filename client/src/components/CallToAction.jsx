import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FaArrowRight, FaBrain } from "react-icons/fa"

function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-[#020617] py-32 px-6">

      {/* Background Glow */}

      <div className="absolute inset-0 flex items-center justify-center">

        <div className="h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[150px]" />

      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-6xl mx-auto"
      >

        <div className="rounded-[40px] border border-slate-800 bg-slate-900/80 
        backdrop-blur-xl p-16 text-center shadow-2xl">

          <div className="flex justify-center mb-8">

            <div className="h-20 w-20 rounded-full bg-cyan-500/20 flex items-center 
            justify-center shadow-[0_0_40px_rgba(34,211,238,0.35)]">

              <FaBrain
                size={42}
                className="text-cyan-400"
              />

            </div>

          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">

            Ready to Study

            <span className="text-cyan-400">
              {" "}Smarter?
            </span>

          </h2>

          <p className="mt-8 max-w-3xl mx-auto text-lg leading-8 text-gray-400">

            Join NeuroLearn and experience AI-powered
            learning with personalized study plans,
            intelligent quizzes, flashcards, notes,
            and real-time performance analytics.

          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-6">

            <Link
              to="/register"
              className="group flex items-center gap-3 rounded-xl bg-cyan-500 
              px-8 py-4 font-semibold text-black transition-all duration-300 
              hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.4)]"
            >
              Get Started

              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-slate-700 px-8 py-4 text-white transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800"
            >
              Sign In
            </Link>

          </div>

        </div>

      </motion.div>

    </section>
  )
}

export default CallToAction