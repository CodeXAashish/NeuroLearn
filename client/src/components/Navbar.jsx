import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaBrain, FaBars, FaTimes} from "react-icons/fa"
import { useState } from "react"

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

        {/* Logo */}

        <Link to="/" className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">

            <FaBrain className="text-white text-2xl" />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Neuro<span className="text-cyan-400">Learn</span>
            </h1>

            <p className="text-xs text-gray-400">
              AI Learning Platform
            </p>

          </div>

        </Link>

        {/* Navigation */}

        <div className="hidden md:flex items-center gap-8">

          <a href="#features" className="text-gray-300 hover:text-cyan-400 transition">
            Features
          </a>

          <a href="#about" className="text-gray-300 hover:text-cyan-400 transition">
            About
          </a>

          <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition">
            Contact
          </a>

        </div>

        {/* Desktop */}

<div className="hidden md:flex gap-4">
  <Link
    to="/login"
    className="px-5 py-2 rounded-lg border border-slate-700 text-white hover:border-cyan-400 transition"
  >
    Sign In
  </Link>

  <Link
    to="/register"
    className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
  >
    Get Started
  </Link>
</div>

{/* Mobile */}

<button
  className="md:hidden text-white text-2xl"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? <FaTimes /> : <FaBars />}
</button>

      </div>
             {menuOpen && (
  <div className="md:hidden bg-slate-900 border-t border-slate-800 px-6 py-6">

    <a href="#features" className="block py-3 text-white">
      Features
    </a>

    <a href="#about" className="block py-3 text-white">
      About
    </a>

    <a href="#contact" className="block py-3 text-white">
      Contact
    </a>

    <Link
      to="/login"
      className="block mt-4 rounded-lg border border-slate-700 text-center py-3"
    >
      Sign In
    </Link>

    <Link
      to="/register"
      className="block mt-3 rounded-lg bg-cyan-500 text-center py-3 text-black font-semibold"
    >
      Get Started
    </Link>

  </div>
)}
    </motion.nav>
  )
}



export default Navbar