import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import {
  FaBrain,
  FaBars,
  FaHome,
  FaBook,
  FaClipboardList,
  FaLayerGroup,
  FaComments,
  FaUserCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa"

import {
  hasUnresolvedMistakes,
} from "../services/mistakeService"

function DashboardNavbar() {
  const location = useLocation()

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  )

  const [menuOpen, setMenuOpen] =
    useState(false)

  const [hasMistakes, setHasMistakes] =
    useState(false)

  // ========================================
  // Check unresolved mistakes
  // ========================================

  const checkMistakes = async () => {
    try {
      const data =
        await hasUnresolvedMistakes()

      setHasMistakes(
        data.hasMistakes
      )
    } catch (error) {
      console.error(
        "Mistake notification error:",
        error
      )
    }
  }

  useEffect(() => {
    checkMistakes()
  }, [])

  // ========================================
  // Navigation items
  // ========================================

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },

    {
      name: "Planner",
      path: "/planner",
      icon: <FaClipboardList />,
    },

    {
      name: "Notes",
      path: "/notes",
      icon: <FaBook />,
    },

    {
      name: "Quiz",
      path: "/quiz",
      icon: <FaBrain />,
    },

    {
      name: "Flashcards",
      path: "/flashcards",
      icon: <FaLayerGroup />,
    },

    {
      name: "AI Tutor",
      path: "/chat",
      icon: <FaComments />,
    },

    {
      name: "Mistakes",
      path: "/mistakes",
      icon: <FaExclamationTriangle />,
    },
  ]

  // ========================================
  // Render navigation item
  // ========================================

  const renderNavItem = (item) => {
    const active =
      location.pathname === item.path

    const isMistakes =
      item.name === "Mistakes"

    return (
      <Link
        key={item.name}
        to={item.path}
        className={`relative flex items-center gap-1 rounded-xl px-3 py-2 transition-all duration-300 ${
          active
            ? "bg-cyan-500 text-black"
            : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
        }`}
      >
        {item.icon}

        <span className="whitespace-nowrap text-sm font-medium">
          {item.name}
        </span>

        {/* Mistake notification badge */}

        {isMistakes && hasMistakes && (
          <span
            className="ml-1 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            title="You have unresolved mistakes"
          />
        )}

        {active && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 -z-10 rounded-xl bg-cyan-500"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        )}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#020617]/90 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-8">

        {/* ================================= */}
        {/* Logo */}
        {/* ================================= */}

        <Link
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500 text-black">
            <FaBrain size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              NeuroLearn
            </h1>

            <p className="text-xs text-slate-400">
              AI Study Companion
            </p>
          </div>
        </Link>

        {/* ================================= */}
        {/* Desktop Navigation */}
        {/* ================================= */}

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map(renderNavItem)}
        </nav>

        {/* ================================= */}
        {/* Mobile Menu Button */}
        {/* ================================= */}

        <button
          className="text-2xl text-white lg:hidden"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

        {/* ================================= */}
        {/* User */}
        {/* ================================= */}

        <div className="hidden items-center lg:flex">

          <button className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-2 transition hover:border-cyan-400">

            <FaUserCircle
              size={34}
              className="text-cyan-400"
            />

            <div className="hidden text-left md:block">

              <p className="text-sm font-medium text-white">
                {user?.name || "Student"}
              </p>

              <p className="text-xs text-slate-400">
                {user?.email || "No Email"}
              </p>

            </div>

          </button>

        </div>

      </div>

      {/* ================================= */}
      {/* Mobile Menu */}
      {/* ================================= */}

      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-900 lg:hidden">

          {navItems.map((item) => {

            const active =
              location.pathname === item.path

            const isMistakes =
              item.name === "Mistakes"

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-4 ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-white hover:bg-slate-800"
                }`}
                onClick={() =>
                  setMenuOpen(false)
                }
              >

                {item.icon}

                <span>
                  {item.name}
                </span>

                {/* Mobile mistake badge */}

                {isMistakes &&
                  hasMistakes && (
                    <span
                      className="ml-1 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                      title="You have unresolved mistakes"
                    />
                  )}

              </Link>
            )
          })}

          <hr className="my-2 border-slate-700" />

          <div className="px-6 py-4">

            <p className="font-semibold text-white">
              {user?.name || "Student"}
            </p>

            <p className="text-sm text-slate-400">
              {user?.email || "No Email"}
            </p>

          </div>

        </div>
      )}

    </header>
  )
}

export default DashboardNavbar