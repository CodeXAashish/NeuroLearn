import { useState } from "react"
import { Link } from "react-router-dom"
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa"

import AuthBackground from "../components/AuthBackground"
import AuthCard from "../components/AuthCard"
import AuthInput from "../components/AuthInput"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Your login API will be connected here
    console.log({
      email,
      password,
      remember,
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">

      <AuthBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-between px-8">

        {/* Left */}

        <div className="hidden w-1/2 lg:flex flex-col justify-center">

          <h1 className="text-5xl font-black leading-tight text-white">

            Welcome to

            <span className="text-cyan-400">
              {" "}NeuroLearn
            </span>

          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">

            Continue your personalized AI learning
            journey with quizzes, notes,
            flashcards and study planner.

          </p>

          <img
            src="/images/login-ai.png"
            alt="AI"
            className="mt-12 w-[430px]"
          />

        </div>

        {/* Right */}

        <AuthCard
          title="Welcome Back 👋"
          subtitle="Sign in to continue learning."
        >

          <form
            onSubmit={handleSubmit}
          >

            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              icon={<FaEnvelope />}
            />

            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              icon={<FaLock />}
            />

            <div className="mb-8 flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-gray-400">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() =>
                    setRemember(!remember)
                  }
                />

                Remember Me

              </label>

              <button
                type="button"
                onClick={() => alert("Coming Soon")}
                className="text-sm text-cyan-400 hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:scale-[1.02] hover:bg-cyan-400"
            >
              Sign In
            </button>

            <div className="my-5 flex items-center">

              <div className="h-px flex-1 bg-slate-700" />

              <span className="mx-4 text-sm text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-700" />

            </div>

            <button
              type="button"
               onClick={() => alert("Google Sign-In coming soon")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 py-4 text-white transition hover:border-cyan-400 hover:bg-slate-800"
            >

              <FaGoogle />

              Continue with Google

            </button>

            <p className="mt-5 text-center text-gray-400">

              Don't have an account?

              <Link
                to="/register"
                className="ml-2 text-cyan-400 hover:underline"
              >
                Sign Up
              </Link>

            </p>

          </form>

        </AuthCard>

      </div>

    </div>
  )
}

export default Login