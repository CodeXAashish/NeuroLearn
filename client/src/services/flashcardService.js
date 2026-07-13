import axios from "axios"

const API = "http://localhost:5000/api/flashcards"

export const generateFlashcards = async (data) => {
  const response = await axios.post(`${API}/generate`, data)

  return response.data
}