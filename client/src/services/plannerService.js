import axios from "axios"

const API = "http://localhost:5000/api/planner"

export const setupStudyPlan = async (data) => {
  const response = await axios.post(
    `${API}/setup`,
    data
  )

  return response.data
}

export const getTodayPlan = async () => {
  const response = await axios.get(
    `${API}/today`
  )

  return response.data
}