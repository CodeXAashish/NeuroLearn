import axios from "axios"

const API_URL =
  "http://localhost:5000/api/chat"

const getAuthConfig = () => {
  const token = localStorage.getItem("token")

return {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}
}

export const sendMessage = async (
  messages
) => {
  const response = await axios.post(
    API_URL,
    { messages },
    getAuthConfig()
  )

  return response.data
}

export const getStudyContext = async () => {
  const response = await axios.get(
    `${API_URL}/context`,
    getAuthConfig()
  );

  return response.data;
};