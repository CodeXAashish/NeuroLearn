import { motion } from "framer-motion"
import {
  FaCalendarAlt,
  FaBook,
  FaChartLine,
  FaLayerGroup,
  FaRobot,
  FaCheckCircle,
} from "react-icons/fa"

function DashboardPreview() {
  return (
    <section className="bg-[#020617] py-28 px-8">

      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white">
            Your Personal
            <span className="text-cyan-400">
              {" "}Learning Dashboard
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-400 max-w-3xl mx-auto">
            Everything you need to plan, learn, practice and improve —
            all from one intelligent dashboard.
          </p>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl"
        >

          {/* Top Cards */}

          <div className="grid md:grid-cols-4 gap-6 mb-8">

            <div className="bg-slate-800 rounded-2xl p-6">
              <FaCalendarAlt className="text-cyan-400 text-3xl mb-4" />
              <h3 className="text-white font-semibold">
                Study Planner
              </h3>
              <p className="text-gray-400 mt-2">
                Day 12 / 30
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <FaChartLine className="text-green-400 text-3xl mb-4" />
              <h3 className="text-white font-semibold">
                Accuracy
              </h3>
              <p className="text-3xl text-green-400 mt-2">
                82%
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <FaBook className="text-purple-400 text-3xl mb-4" />
              <h3 className="text-white font-semibold">
                Notes
              </h3>
              <p className="text-gray-400 mt-2">
                56 Generated
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <FaLayerGroup className="text-pink-400 text-3xl mb-4" />
              <h3 className="text-white font-semibold">
                Flashcards
              </h3>
              <p className="text-gray-400 mt-2">
                240 Reviewed
              </p>
            </div>

          </div>

          {/* Bottom Section */}

          <div className="grid lg:grid-cols-2 gap-8">

            <div className="bg-slate-800 rounded-2xl p-6">

              <h3 className="text-2xl font-semibold text-white mb-6">
                Today's Progress
              </h3>

              <div className="w-full bg-slate-700 rounded-full h-4">

                <div
                  className="bg-cyan-400 h-4 rounded-full"
                  style={{ width: "70%" }}
                />

              </div>

              <p className="text-gray-400 mt-4">
                70% Completed
              </p>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6">

              <h3 className="text-2xl font-semibold text-white mb-6">
                Weak Topics
              </h3>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-red-400" />
                  <span className="text-gray-300">
                    DBMS - Normalization
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-orange-400" />
                  <span className="text-gray-300">
                    Operating System
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FaRobot className="text-cyan-400" />
                  <span className="text-gray-300">
                    AI recommends revising DBMS today.
                  </span>
                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  )
}

export default DashboardPreview