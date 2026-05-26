import axios from "axios"

const API_URL =
  "http://localhost:5000/api/quiz"

export const generateQuiz = async (
  quizData
) => {
  const response = await axios.post(
    `${API_URL}/generate`,
    quizData
  )

  return response.data
}