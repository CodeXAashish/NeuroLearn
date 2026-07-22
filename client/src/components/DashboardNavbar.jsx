import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  FaBrain,
  FaHome,
  FaBook,
  FaClipboardList,
  FaLayerGroup,
  FaComments,
  FaChartBar,
  FaBell,
  FaUserCircle,
} from "react-icons/fa"

function DashboardNavbar() {
  const location = useLocation()

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
    // {
    //   name: "Analytics",
    //   path: "/analytics",
    //   icon: <FaChartBar />,
    // },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#020617]/90 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        {/* Logo */}

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

        {/* Navigation */}

        <nav className="hidden items-center gap-2 lg:flex">

          {navItems.map((item) => {

            const active =
              location.pathname === item.path

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 ${
                  active
                    ? "bg-cyan-500 text-black"
                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                }`}
              >
                {item.icon}

                <span className="text-sm font-medium">
                  {item.name}
                </span>

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
          })}

        </nav>

        {/* Right Side */}

        <div className="flex items-center gap-5">

          <button className="relative text-slate-300 transition hover:text-cyan-400">

            <FaBell size={20} />

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />

          </button>

          <button className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-2 transition hover:border-cyan-400">

            <FaUserCircle
              size={34}
              className="text-cyan-400"
            />

            <div className="hidden text-left md:block">

              <p className="text-sm font-medium text-white">
                Aashish
              </p>

              <p className="text-xs text-slate-400">
                Student
              </p>

            </div>

          </button>

        </div>

      </div>

    </header>
  )
}

export default DashboardNavbar