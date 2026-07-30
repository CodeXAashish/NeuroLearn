import axios from "axios"

const API = `${import.meta.env.VITE_API_URL}/api/flashcards`

export const generateFlashcards = async (data) => {
  const response = await axios.post(`${API}/generate`, data)

  return response.data
}