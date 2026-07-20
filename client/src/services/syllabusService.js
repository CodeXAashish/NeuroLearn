import axios from "axios"

const API_URL = "http://localhost:5000/api/syllabus"

export const uploadSyllabus = async (file) => {
  const token = localStorage.getItem("token")

  const formData = new FormData()
  formData.append("pdf", file)

  const response = await axios.post(
    `${API_URL}/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data
}

export const getMySyllabuses = async () => {
  const token = localStorage.getItem("token")

  const response = await axios.get(
    `${API_URL}/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}