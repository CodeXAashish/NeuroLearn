import axios from "axios"

const API_URL = "http://localhost:5000/api/quiz"

const getConfig = () => {
  const token = localStorage.getItem("token")

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const generateQuiz = async (quizData) => {
  const response = await axios.post(
    `${API_URL}/generate`,
    quizData,
    getConfig()
  )

  return response.data
}

export const submitQuiz = async (quizData) => {
  const response = await axios.post(
    `${API_URL}/submit`,
    quizData,
    getConfig()
  )

  return response.data
}