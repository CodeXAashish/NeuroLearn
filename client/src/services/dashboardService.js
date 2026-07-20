import axios from "axios"

const API = "http://localhost:5000/api/dashboard"

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})

export const getHeroData = async () => {
  const response = await axios.get(
    `${API}/hero`,
    getAuthConfig()
  )

  return response.data
}