import { motion } from "framer-motion"
import {
  FaBook,
  FaBrain,
  FaChartLine,
  FaRobot,
  FaCalendarAlt,
  FaLayerGroup,
} from "react-icons/fa"

const features = [
  {
    icon: <FaBook size={32} />,
    title: "AI Notes",
    description:
      "Generate clear and structured notes instantly from any topic.",
    color: "text-cyan-400",
  },
  {
    icon: <FaBrain size={32} />,
    title: "Smart Quiz",
    description:
      "Adaptive quizzes that adjust to your learning progress.",
    color: "text-purple-400",
  },
  {
    icon: <FaLayerGroup size={32} />,
    title: "Flashcards",
    description:
      "Revise efficiently with interactive AI-powered flashcards.",
    color: "text-pink-400",
  },
  {
    icon: <FaCalendarAlt size={32} />,
    title: "Study Planner",
    description:
      "Daily AI-generated study plans based on your exam schedule.",
    color: "text-green-400",
  },
  {
    icon: <FaRobot size={32} />,
    title: "AI Tutor",
    description:
      "Ask questions anytime and get personalized explanations.",
    color: "text-yellow-400",
  },
  {
    icon: <FaChartLine size={32} />,
    title: "Analytics",
    description:
      "Track your accuracy, weak topics, and overall improvement.",
    color: "text-orange-400",
  },
]

function Features() {
  return (
    <section
      id="features"
      className="bg-[#020617] py-28 px-8"
    >
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-white">
            Everything You Need
            <span className="text-cyan-400">
              {" "}to Study Smarter
            </span>
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            NeuroLearn combines AI-powered learning tools into one platform,
            helping you learn faster, remember more, and improve consistently.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-lg hover:border-cyan-500 transition-all"
            >
              <div className={feature.color}>
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold text-white mt-6">
                {feature.title}
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                {feature.description}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default Features