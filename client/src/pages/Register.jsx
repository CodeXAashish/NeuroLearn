import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/authService"
import {
  FaEnvelope,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa"

import AuthBackground from "../components/AuthBackground"
import AuthCard from "../components/AuthCard"
import AuthInput from "../components/AuthInput"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agree, setAgree] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (password !== confirmPassword) {
    return alert("Passwords do not match")
  }

  if (!agree) {
    return alert("Please accept the Terms & Conditions")
  }

  try {
    const data = await registerUser({
      email,
      password,
    })

    localStorage.setItem("token", data.token)

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    )

    navigate("/dashboard")

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Registration failed"
    )
  }
}
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">

      <AuthBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-between px-8">

        {/* Left Side */}

        <div className="hidden w-1/2 lg:flex flex-col justify-center">

          <h1 className="text-6xl font-black text-white leading-tight">
            Start Learning with
            <span className="text-cyan-400">
              {" "}NeuroLearn
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-slate-300 leading-8">
            Create your account and unlock personalized
            study plans, AI-generated notes,
            adaptive quizzes, flashcards
            and detailed analytics.
          </p>

          <div className="mt-10 space-y-6">

            {[
              "Personalized Study Planner",
              "AI Notes Generator",
              "Adaptive Quiz System",
              "Interactive Flashcards",
              "Performance Analytics",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4"
              >
                <FaCheckCircle className="text-cyan-400" />

                <span className="text-slate-300">
                  {item}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* Right Side */}

        <AuthCard
          title="Create Account"
          subtitle="Begin your AI-powered learning journey."
        >

          <form onSubmit={handleSubmit}>

            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter your email"
              icon={<FaEnvelope />}
            />

            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Create password"
              icon={<FaLock />}
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              icon={<FaLock />}
            />

            <label className="mb-6 flex items-center gap-3 text-sm text-slate-400">

              <input
                type="checkbox"
                checked={agree}
                onChange={() =>
                  setAgree(!agree)
                }
              />

              I agree to the Terms & Conditions

            </label>

            <button
              disabled={!agree}
              className="w-full rounded-xl bg-cyan-500 py-4 font-semibold text-black transition hover:scale-[1.02] hover:bg-cyan-400 disabled:opacity-50"
            >
              Create Account
            </button>

            <p className="mt-8 text-center text-slate-400">

              Already have an account?

              <Link
                to="/login"
                className="ml-2 text-cyan-400 hover:underline"
              >
                Sign In
              </Link>

            </p>

          </form>

        </AuthCard>

      </div>

    </div>
  )
}

export default Register