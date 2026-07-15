import { motion } from "framer-motion"

function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Main Glow */}

      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-[90px]" />

      <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-[150px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "45px 45px",
        }}
      />

      {/* Floating Orbs */}

      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-cyan-400/20"
          style={{
            width: 10 + index * 5,
            height: 10 + index * 5,
            left: `${10 + index * 10}%`,
            top: `${15 + (index % 4) * 18}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
          }}
        />
      ))}

    </div>
  )
}

export default AuthBackground