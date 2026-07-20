import axios from "axios"

const API = "http://localhost:5000/api/planner"

const getAuthConfig = () => {
  const token = localStorage.getItem("token")

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const setupStudyPlan = async (data) => {
  const response = await axios.post(
    `${API}/setup`,
    data,
    getAuthConfig()
  )

  return response.data
}

export const getTodayPlan = async () => {
  const response = await axios.get(
    `${API}/today`,
    getAuthConfig()
  )

  return response.data
}

export const completeTodayPlan = async () => {
  const response = await axios.post(
    `${API}/complete`,
    {},
    getAuthConfig()
  )

  return response.data
}

export const getProgress = async () => {
  const response = await axios.get(
    `${API}/progress`,
    getAuthConfig()
  )

  return response.data
}