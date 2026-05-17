import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { loginUser } from "../services/authService"

function Login() {
  const navigate = useNavigate()

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

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

        <button className="w-full bg-blue-600 p-3 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login