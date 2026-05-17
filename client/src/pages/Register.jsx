import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { registerUser } from "../services/authService"

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
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
      const data = await registerUser(formData)

      localStorage.setItem("token", data.token)

      alert("Registration Successful")

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
          NeuroLearn Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

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

        <button className="w-full bg-green-600 p-3 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register