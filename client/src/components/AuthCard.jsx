import { motion } from "framer-motion"

function AuthCard({
  title,
  subtitle,
  children,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 80,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.8,
      }}
      className="w-full max-w-[420px]"
    >

      <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-7 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,.35)]">

        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-3 text-slate-400">
          {subtitle}
        </p>

        <div className="mt-6">
          {children}
        </div>

      </div>

    </motion.div>
  )
}

export default AuthCard