import { FaBrain, FaGithub, FaLinkedin } from "react-icons/fa"

function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-slate-800">

      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="grid md:grid-cols-4 gap-12">

          {/* Logo */}

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center">

                <FaBrain className="text-white text-2xl" />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">

                  Neuro
                  <span className="text-cyan-400">
                    Learn
                  </span>

                </h2>

                <p className="text-gray-400 text-sm">
                  AI Study Companion
                </p>

              </div>

            </div>

            <p className="text-gray-400 mt-6 leading-7">

              Learn smarter with AI-generated notes,
              quizzes, flashcards, study plans,
              and performance analytics.

            </p>

          </div>

          {/* Features */}

          <div>

            <h3 className="text-white font-semibold text-lg mb-5">
              Features
            </h3>

            <ul className="space-y-3 text-gray-400">

              <li>Study Planner</li>
              <li>AI Notes</li>
              <li>Quiz Generator</li>
              <li>Flashcards</li>
              <li>Analytics</li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-white font-semibold text-lg mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-gray-400">

              <li>About</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>

            </ul>

          </div>

          {/* Social */}

          <div>

            <h3 className="text-white font-semibold text-lg mb-5">
              Connect
            </h3>

            <div className="flex gap-4">

              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-cyan-500 transition"
              >
                <FaGithub className="text-white text-xl" />
              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-cyan-500 transition"
              >
                <FaLinkedin className="text-white text-xl" />
              </a>

            </div>

          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-gray-500">

          © 2026 NeuroLearn. All rights reserved.

        </div>

      </div>

    </footer>
  )
}

export default Footer