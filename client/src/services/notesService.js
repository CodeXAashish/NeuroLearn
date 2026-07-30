import axios from "axios"

const API =
  `${import.meta.env.VITE_API_URL}/api/notes`

export const generateNotes = async (data) => {
  const response =
    await axios.post(
      `${API}/generate`,
      data
    )

  return response.data
}