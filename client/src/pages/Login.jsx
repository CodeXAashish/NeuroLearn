import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { loginUser } from "../services/authService"

function Login() {

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const data = await loginUser(formData)

      localStorage.setItem("token", data.token)

      alert("Login Successful")

      navigate("/dashboard")

    } catch (error) {

      alert(error.response.data.message)

    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          NeuroLearn Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

        <div className="relative mb-4">

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>

        </div>

        <button className="w-full bg-blue-600 p-3 rounded hover:bg-blue-700">
          Login
        </button>

      </form>

    </div>
  )
}

export default Login