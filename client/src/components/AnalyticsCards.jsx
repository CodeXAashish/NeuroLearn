import { motion } from "framer-motion"
import {
  FaClipboardCheck,
  FaBullseye,
  FaExclamationTriangle,
} from "react-icons/fa"

function AnalyticsCards({ analytics }) {
  const cards = [
    {
      title: "Total Quizzes",
      value: analytics.totalQuizzes,
      subtitle: "Completed",
      trend: "Keep practicing",
      icon: <FaClipboardCheck />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Average Score",
      value: `${analytics.averageScore}%`,
      subtitle: "Overall Performance",
      trend: "Excellent",
      icon: <FaBullseye />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Weak Topics",
      value: analytics.weakTopics.length,
      subtitle: "Need Revision",
      trend: "Need attention",
      icon: <FaExclamationTriangle />,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">

      {cards.map((card, index) => (

        <motion.div
          key={card.title}
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: index * .15,
          }}
          whileHover={{
            y: -5,
            scale: 1.02
          }}
          className="rounded-3xl border border-slate-800
           bg-slate-900/70 p-6 backdrop-blur-xl shadow-lg 
           transition-all duration-300 hover:border-cyan-500/40 
           hover:shadow-cyan-500/10">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                {card.title}
              </p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                {card.value}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {card.subtitle}
              </p>

            </div>

            <motion.div
  whileHover={{
    rotate: 8,
    scale: 1.1,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
  }}
  className={`rounded-2xl bg-gradient-to-r ${card.color} p-4 text-2xl text-white shadow-lg`}
>
  {card.icon}
</motion.div>

          </div>

        </motion.div>

      ))}

    </div>
  )
}

export default AnalyticsCards