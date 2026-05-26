import axios from "axios"

const API_URL =
  "http://localhost:5000/api/chat"

export const sendMessage = async (
  messages
) => {
  const response = await axios.post(
    API_URL,
    { messages }
  )

  return response.data
}