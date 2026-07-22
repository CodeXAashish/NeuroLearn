import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  FaBook,
  FaClipboardList,
  FaLayerGroup,
  FaRobot,
  FaChartLine,
  FaQuestionCircle,
  FaFileUpload,
} from "react-icons/fa"

function FeatureGrid() {
  const features = [
  {
    title: "Upload PDF",
    description: "Upload syllabus or study material",
    icon: <FaFileUpload />,
    link: "/study-materials",
    color: "text-cyan-400",
    glow: "hover:shadow-cyan-500/20",
  },
  {
    title: "Planner",
    description: "Create your daily study plan",
    icon: <FaClipboardList />,
    link: "/planner",
    color: "text-green-400",
    glow: "hover:shadow-green-500/20",
  },
  {
    title: "AI Tutor",
    description: "Ask your AI assistant",
    icon: <FaRobot />,
    link: "/chat",
    color: "text-purple-400",
    glow: "hover:shadow-purple-500/20",
  },
  {
    title: "Notes",
    description: "Generate AI study notes",
    icon: <FaBook />,
    link: "/notes",
    color: "text-blue-400",
    glow: "hover:shadow-blue-500/20",
  },
  {
    title: "Flashcards",
    description: "Revise with flashcards",
    icon: <FaLayerGroup />,
    link: "/flashcards",
    color: "text-pink-400",
    glow: "hover:shadow-pink-500/20",
  },
  {
    title: "Quiz",
    description: "Practice with AI quizzes",
    icon: <FaQuestionCircle />,
    link: "/quiz",
    color: "text-yellow-400",
    glow: "hover:shadow-yellow-500/20",
  },
]

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {features.map((feature, index) => (

        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          whileHover={{
            y: -10,
            scale: 1.03,
          }}
        >

          <Link
  to={feature.link}
  className={`block rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 ${feature.glow} hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-500/10`}
>

            <motion.div
  whileHover={{
    rotate: 8,
    scale: 1.1,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
  }}
  className={`mb-5 text-5xl ${feature.color}`}
>
  {feature.icon}
</motion.div>
            <h3 className="text-2xl font-bold text-white">
              {feature.title}
            </h3>

            <p className="mt-3 text-slate-400">
              {feature.description}
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm font-medium text-cyan-400">
  Open Module →
</p>

          </Link>

        </motion.div>

      ))}

    </div>
  )
}

export default FeatureGrid