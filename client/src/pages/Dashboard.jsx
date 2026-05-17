import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")

    navigate("/")
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6">
        Welcome to NeuroLearn Dashboard 🚀
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 px-6 py-3 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard